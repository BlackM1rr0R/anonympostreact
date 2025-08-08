import React, { useState, useEffect, useContext } from 'react';
import styles from './index.module.css';
import Wrapper from '../UI/wrapper';
import { addPost } from '../../api';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Post = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !title.trim()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", user.username);
    if (image) {
      formData.append("image", image);
    }

    try {
      const newPost = await addPost(formData);
      alert("Post gönderildi!");
      setTitle('');
      setContent('');
      setImage(null);
      if (onPostCreated) onPostCreated(newPost);
      navigate('/');
    } catch (error) {
      console.error("Post gönderilemedi:", error);
    }
  };

  return (
    <Wrapper>
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
              <input
                type="text"
                placeholder={t('content')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

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
    </Wrapper>
  );
};

export default Post;
