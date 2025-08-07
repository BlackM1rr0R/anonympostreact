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
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    ip: '',
    password: '',
  });
  const { darkMode, toggleTheme } = useContext(ThemeContext)
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await myProfile();
        console.log("Profile data:", profileData);
        setUser(profileData);
        setUserInfo({
          username: profileData.username,
          ip: profileData.ip,
          password: profileData.password || '',
        });
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

        <div className={styles.profileForm}>
          <label>{t("username")}</label>
          <input
            type="text"
            value={userInfo.username}
            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
            readOnly={!editMode}
          />

          <label>{t("ipAdress")}</label>
          <input
            type="text"
            value={userInfo.ip}
            onChange={(e) => setUserInfo({ ...userInfo, ip: e.target.value })}
            readOnly={!editMode}
          />

          <label>{t("password")}</label>
          <input
            type="password"
            value={userInfo.password}
            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
            readOnly={!editMode}
          />

          {user?.createdAt && (
            <p className={styles.joined}><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          )}

          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? t("save") : t("edit")}
          </button>
        </div>


        <h2>{t("myPosts")}</h2>
        <div className={styles.postsList}>

          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className={styles.myPost}>
                <div className={styles.postHeader}>
                  <p className={styles.username}>
                    <strong>{t("username")}:</strong> {post.author}
                  </p>
                </div>
                <div className={styles.postContent}>
                  <h3 className={styles.postTitle}>
                    <strong>{t("title")}:</strong> {post.title}
                  </h3>
                  <p className={styles.postText}>
                    <strong>{t("content")}:</strong> {post.content}
                  </p>
                </div>

                {post.imageUrl && (
                  <div className={styles.imageWrapper}>
                    <img
                      src={`http://localhost:6060${post.imageUrl}`}
                      alt="Post"
                      className={styles.postImage}
                    />
                  </div>
                )}

                <button onClick={() => handleEdit(post)}>{t("edit")}</button>

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
                    <button onClick={handleUpdate}>{t("save")}</button>
                    <button onClick={() => setEditingPost(null)}>{t("cancel")}</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>{t("noPostFound")}</p>
          )}
        </div>

      </div>
    </Wrapper>
  );
};

export default MyProfile;
