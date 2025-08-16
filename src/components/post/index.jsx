import React, { useState, useEffect, useContext } from 'react';
import styles from './index.module.css';
import Wrapper from '../UI/wrapper';
import { addPost, getAllCategory } from '../../api';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Post = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(''); 

  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  // Kullanıcı kontrolü
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  // Kategorileri getir
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategory();
        setCategories(res.data || res);
      } catch (err) {
        console.error("Kategoriler alınamadı:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !title.trim() || !category) {
      alert("Lütfen başlık, içerik ve kategori seçiniz");
      return;
    }
    if (!image) {
      alert("Lütfen bir resim yükleyin");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", user.username);
    formData.append("category", category); // ✅ Backend "category" bekliyor
    formData.append("image", image); // ✅ image zorunlu

    try {
      const newPost = await addPost(formData);
      alert("Post gönderildi!");
      setTitle('');
      setContent('');
      setImage(null);
      setCategory('');
      if (onPostCreated) onPostCreated(newPost);
      navigate('/');
    } catch (error) {
      console.error("Post gönderilemedi:", error);
    }
  };

  return (
    <div className={`${styles.control} ${darkMode ? styles.dark : styles.light}`}>
      <h1 className={styles.titleAnonym}>{t("addAnonymPost")}</h1>
      <div className={styles.postCreate}>
        <form onSubmit={handleSubmit}>
          <div className={styles.input}>
            <input
              type="text"
              placeholder={t('title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder={t('content')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* Kategori Select */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              <option value="">{t("selectCategories")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            {/* Resim Yükleme */}
            <div className={styles.fileInputWrapper}>
              <label htmlFor="fileUpload" className={styles.customFileLabel}>
                📷 {t("addPhoto")}
              </label>
              <input
                type="file"
                id="fileUpload"
                accept="image/*"
                className={styles.hiddenFileInput}
                onChange={(e) => setImage(e.target.files[0])}
              />
              {image && <span className={styles.fileName}>{image.name}</span>}
            </div>
          </div>

          <div className={styles.button}>
            <button type='submit'>{t("share")}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;