import React, { useContext, useEffect, useState } from 'react';
import styles from './index.module.css';
import Wrapper from '../../components/UI/wrapper';
import { getMyPosts, editPost, myProfile } from '../../api';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const { darkMode, toggleTheme } = useContext(ThemeContext)
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await myProfile();
        console.log("Profile data:", profileData);
        setUser(profileData);
        const response = await getMyPosts();
        setPosts(response);
      } catch (error) {
        console.error("Error fetching profile or posts:", error);
      }
    };

    fetchData();
  }, []);


  const handleEdit = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdate = async () => {
    try {
      const updatedPost = {
        ...editingPost,
        title: editTitle,
        content: editContent,
      };
      const updated = await editPost(updatedPost);
      const updatedList = posts.map(p => p.id === updated.id ? updated : p);
      setPosts(updatedList);
      setEditingPost(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!user) {
    return <Wrapper><p>Loading profile...</p></Wrapper>;
  }

  return (
    <Wrapper>
      <div className={styles.control} data-theme={darkMode ? 'dark' : 'light'}>

        <h1>{t("myProfile")}</h1>
        <p><strong>{t("username")}:</strong> {user.username}</p>
        <p><strong>{t("role")}:</strong> {user.role}</p>
        <p><strong>{t("ipAdress")}:</strong> {user.ip}</p>
        <p><strong>{t("password")}:</strong> <button>Edit</button></p>
        {user.createdAt && (
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        )}

        <h2>{t("myPosts")}</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className={styles.myPost}>
              <h3>{t("title")}:{post.title}</h3>
              <p>{t("content")}:{post.content}</p>
              <p><strong>{t("username")}:</strong> {post.author}</p>
              {post.imageUrl && (
                <img
                  src={`http://localhost:6060${post.imageUrl}`}
                  alt="My Post"
                  style={{ maxWidth: '300px', marginTop: '10px' }}
                />
              )}
              <button onClick={() => handleEdit(post)}>{t("edit")}</button>

              {/* Sadece bu post düzenleniyorsa göster */}
              {editingPost?.id === post.id && (
                <div className={styles.editForm}>
                  <h4>{t("edit")}</h4>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder={t("title")}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder={t("content")}
                  />
                  <div style={{ marginTop: '10px' }}>
                    <button onClick={handleUpdate}>{t("save")}</button>
                    <button
                      onClick={() => setEditingPost(null)}
                      style={{ marginLeft: '10px' }}
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>{t("noPostFound")}</p>
        )}
      </div>
    </Wrapper>
  );
};

export default MyProfile;
