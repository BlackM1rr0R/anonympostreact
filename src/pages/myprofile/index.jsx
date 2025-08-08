import React, { useContext, useEffect, useState } from 'react';
import styles from './index.module.css';
import Wrapper from '../../components/UI/wrapper';
import { getMyPosts, editPost, myProfile, userEditPassword } from '../../api';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editPassword, setEditPassword] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await myProfile();
        setUser(profileData);
        const response = await getMyPosts();
        setPosts(response);
      } catch (error) {
        console.error("Error fetching profile or posts:", error);
      }
    };

    fetchData();
  }, []);

  const handlePasswordChange = async () => {
    try {
      await userEditPassword({ password: editPassword });
      alert(t("passwordChanged"));
      setEditPassword('');
    } catch (error) {
      console.error("Password change failed:", error);
      alert(t("passwordChangeFailed"));
    }
  };


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
        <h1 className={styles.myPostsAll}>{t("myProfile")}</h1>

        <div className={styles.profileForm}>
          <label>{t("username")}</label>
          <input type="text" value={user.username} readOnly />

          <label>{t("ipAdress")}</label>
          <input type="text" value={user.ip} readOnly />

          <label>{t("password")}</label>
          <input
            type="password"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            placeholder={t("New Password")}
          />

          {user?.createdAt && (
            <p className={styles.joined}><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          )}

          <button onClick={handlePasswordChange}>{t("Change Password")}</button>
        </div>

        <h2 className={styles.myPostsAll}>{t("myPosts")}</h2>
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
                      src={`/api${post.imageUrl}`}
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
