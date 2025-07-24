import React, { useContext, useEffect, useState } from "react";
import styles from './index.module.css'
import Wrapper from '../UI/wrapper'
import { allComment, deleteAllPosts, getAllLikes, getAllPosts, toggleLike } from "../../api";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from '../../context/ThemeContext'
import { useTranslation } from "react-i18next";
const AllPosts = ({ newPost }) => {
  const [data, setData] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";
  const { darkMode, toggleTheme } = useContext(ThemeContext)
  const { t } = useTranslation()
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 3;
  useEffect(() => {
    if (newPost) {
      setData(prev => [newPost, ...prev]);
    }
  }, [newPost]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getAllPosts(page, pageSize);
        setData(posts.content);
        setTotalPages(posts.totalPages);
        const commentResults = {};
        const likeCountsObj = {};
        for (const post of posts) {
          const comments = await allComment(post.id);
          commentResults[post.id] = comments;

          const likeCount = await getAllLikes(post.id);
          likeCountsObj[post.id] = likeCount;
        }
        setCommentsMap(commentResults);
        setLikeCounts(likeCountsObj);
      } catch (error) {
        console.error("Error fetching posts or comments:", error);
      }
    };

    fetchData();
  }, [location, page]);

  const handleLike = async (postId) => {
    try {
      const isLiked = await toggleLike(postId);
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: isLiked
          ? (prev[postId] || 0) + 1
          : Math.max((prev[postId] || 1) - 1, 0)
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Wrapper>
      <div className={styles.control} data-theme={darkMode ? 'dark' : 'light'}>
        <h1 className={styles.pageTitle}>{t("allPosts")}</h1>
        {isAdmin && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={async () => {
                try {
                  await deleteAllPosts();
                  window.location.reload();
                } catch (error) {
                  console.error("Postları silerken hata:", error);
                }
              }}
              className={styles.deleteAllButton}
            >
              🗑️ Remove All Posts
            </button>
          </div>
        )}

        <div className={styles.controlPosts}>
          {data.map((post) => (
            <div key={post.id} className={styles.postCard}>
              {post.imageUrl && (
                <img
                  src={`http://localhost:6060${post.imageUrl}`}
                  alt="Post"
                  className={styles.postImage}
                />
              )}

              <Link to={`/post/${post.id}`} className={styles.postContent}>
                <p className={styles.postTitle}>{t("title")}:{post.title}</p>
                <p className={styles.postAuthor}><strong>{t("username")}:</strong> {post.author}</p>
                <p className={styles.postText}>{t("content")}:{post.content}</p>
                <p className={styles.postDate}>{t("date")}:{new Date(post.createdAt).toLocaleDateString()}</p>
              </Link>

              <div className={styles.commentSection}>
                <h4 className={styles.commentHeader}>{t("comments")} ({commentsMap[post.id]?.length || 0})</h4>
                {Array.isArray(commentsMap[post.id]) && commentsMap[post.id].length > 0 ? (
                  commentsMap[post.id].slice(0, 2).map((com) => (
                    <p key={com.id} className={styles.comment}>
                      <strong className={styles.commentUsername}>{com.username || "User"}:</strong> {com.comment}
                    </p>
                  ))
                ) : (
                  <p className={styles.noComment}>{t("noComments")}</p>
                )}
              </div>

              <button onClick={() => handleLike(post.id)} className={styles.likeButton}>
                ❤️ {t("like")} ({Array.isArray(likeCounts[post.id]) ? likeCounts[post.id].length : likeCounts[post.id] || 0})
              </button>
            </div>

          ))}
        </div>
        <div className={styles.paginationContainer}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`${styles.pageButton} ${page === index ? styles.active : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>


      </div>
    </Wrapper>

  );
};

export default AllPosts;
