import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategoryById } from "../../api"; 
import Wrapper from '../../components/UI/wrapper'; 
import styles from './index.module.css';
import { ThemeContext } from "../../context/ThemeContext";

const CategoryPosts = () => {
  const { categoryId } = useParams();
  const [posts, setPosts] = useState([]);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getCategoryById(categoryId);
        setPosts(data);
      } catch (error) {
        console.error("Kategoriye göre postlar alınamadı:", error);
      }
    };
    fetchPosts();
  }, [categoryId]);

  return (
    <Wrapper>
      <div
        className={styles.categoryPosts}
        data-theme={darkMode ? "dark" : "light"}
      >
        <h1 className={styles.pageTitle}>Kategoriye Ait Postlar</h1>

        {posts.length > 0 ? (
          <div className={styles.grid}>
            {posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <Link to={`/post/${post.id}`} className={styles.postLink}>
                  {post.imageUrl && (
                    <img
                      src={`/api${post.imageUrl}`}
                      alt={post.title}
                      className={styles.postImage}
                    />
                  )}
                  <h3 className={styles.postTitle}>{post.title}</h3>
                </Link>
                <p className={styles.postContent}>{post.content}</p>
                <small className={styles.postAuthor}>
                  Yazar: {post.author}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noPosts}>Bu kategoride henüz post yok.</p>
        )}
      </div>
    </Wrapper>
  );
};

export default CategoryPosts;
