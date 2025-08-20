import React, { useEffect, useState, useContext } from "react";
import styles from "./index.module.css";

import { getSaved } from "../../api";
import { Link } from "react-router-dom";
import Wrapper from "../../components/UI/wrapper";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext"; // varsa buradan alıyoruz

const AllSaved = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext); // true/false

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.username) {
          const data = await getSaved();
          setSavedPosts(data);
        } else {
          setError("Kullanıcı bilgisi bulunamadı.");
        }
      } catch (err) {
        console.error("Kaydedilen gönderiler çekilirken hata:", err);
        setError("Kaydedilen gönderiler yüklenemedi. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  const themeClass = darkMode ? styles.dark : styles.light;

  if (loading) {
    return (
      <Wrapper>
        <div className={`${styles.loader} ${themeClass}`}>{t("loading")}</div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div className={`${styles.error} ${themeClass}`}>{error}</div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className={`${styles.savedPostsContainer} ${themeClass}`}>
        <h1 className={styles.titleSaved}>{t("allsaved")}</h1>
        {savedPosts.length === 0 ? (
          <p>{t("nosaved")}</p>
        ) : (
          <div className={styles.postsGrid}>
            {savedPosts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <Link to={`/post/${post.id}`}>
                  {post.imageUrl && (
                    <img
                      src={`/api${post.imageUrl}`}
                      alt=""
                      className={styles.postImage}
                    />
                  )}
                  <div className={styles.postContent}>
                    <p className={styles.postTitle}>
                      <strong>{t("title")}:</strong> {post.title}
                    </p>
                    <p className={styles.postAuthor}>
                      <strong>{t("username")}:</strong> {post.author}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default AllSaved;
