import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

import { getSaved } from "../../api"; // API fonksiyonunuzu import edin
import { Link } from "react-router-dom";
import Wrapper from "../../components/UI/wrapper";
import { useTranslation } from "react-i18next";

const AllSaved = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
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

  if (loading) {
    return (
      <Wrapper>
        <div>Yükleniyor...</div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div>{error}</div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className={styles.savedPostsContainer}>
        <h1 className={styles.titleSaved}>{t("allsaved")}</h1>
        {savedPosts.length === 0 ? (
          <p>{t("nosaved")}</p>
        ) : (
          <div className={styles.postsGrid}>
            {savedPosts.map((post) => {
     
              return (
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
              );
            })}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default AllSaved;
