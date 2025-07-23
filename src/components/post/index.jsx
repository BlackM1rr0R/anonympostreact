import React, { useState, useEffect, useContext } from 'react';
import styles from './index.module.css';
import Wrapper from '../UI/wrapper';
import { addPost } from '../../api';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const Post = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

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
        <h1>Add Your Anonym Post</h1>
        <div className={styles.postCreate}>
          <form onSubmit={handleSubmit}>
            <div className={styles.input}>
              <input
                type="text"
                placeholder='Your Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder='Write your post...'
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className={styles.fileInputWrapper}>
                <label htmlFor="fileUpload" className={styles.customFileLabel}>
                  📷 Add Photo
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
              <button type='submit'>Post</button>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default Post;
