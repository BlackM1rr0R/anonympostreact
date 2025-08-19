import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import Wrapper from "../UI/wrapper";
import {
  allComment,
  deleteAllPosts,
  getAllPosts,
  getLikeCount,
  toggleLike,
  toggleSaved,
  getSaved, // <-- EKLENDİ
} from "../../api";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Like from "../../assets/images/like (1).svg";

const AllPosts = ({ newPost }) => {
  const [data, setData] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});      // { [postId]: boolean }
  const [savingAnim, setSavingAnim] = useState({});      // { [postId]: boolean } - animasyon/disabling
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 16;

  // yeni post geldiyse liste başına ekle
  useEffect(() => {
    if (newPost) {
      setData((prev) => [newPost, ...prev]);
    }
  }, [newPost]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Sayfalanmış postları çek
        const posts = await getAllPosts(page, pageSize);
        setData(posts.content || []);
        setTotalPages(posts.totalPages ?? 0);

        const ids = (posts.content || []).map((p) => p.id);

        // 2) Kaydedilmişleri çek ve eşleştir
        const savedList = await getSaved(); // /saved → PostDto[]
        const savedIdSet = new Set((savedList || []).map((p) => p.id));

        const savedStatusObj = {};
        ids.forEach((id) => (savedStatusObj[id] = savedIdSet.has(id)));
        setSavedPosts(savedStatusObj);

        // İlk yüklemede sayfada saved olanlara kısa animasyon oynat
        const savedOnPageIds = ids.filter((id) => savedIdSet.has(id));
        if (savedOnPageIds.length > 0) {
          setSavingAnim((prev) => {
            const m = { ...prev };
            savedOnPageIds.forEach((id) => (m[id] = true));
            return m;
          });
          setTimeout(() => {
            setSavingAnim((prev) => {
              const m = { ...prev };
              savedOnPageIds.forEach((id) => (m[id] = false));
              return m;
            });
          }, 700);
        }

        // 3) Yorum ve beğeni sayılarını paralel çek
        const commentsPromises = ids.map((id) => allComment(id).catch(() => []));
        const likesPromises = ids.map((id) => getLikeCount(id).catch(() => 0));

        const commentsResults = await Promise.all(commentsPromises);
        const likesResults = await Promise.all(likesPromises);

        const commentMap = {};
        const likesMap = {};
        ids.forEach((id, idx) => {
          commentMap[id] = commentsResults[idx] || [];
          likesMap[id] = likesResults[idx] || 0;
        });

        setCommentsMap(commentMap);
        setLikeCounts(likesMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location, page]);

  const handleLike = async (postId) => {
    try {
      await toggleLike(postId);
      const updatedCount = await getLikeCount(postId);
      setLikeCounts((prev) => ({ ...prev, [postId]: updatedCount }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSaveToggle = async (postId) => {
    // çifte tıklamayı engelle
    if (savingAnim[postId]) return;
    try {
      setSavingAnim((prev) => ({ ...prev, [postId]: true }));
      await toggleSaved(postId);

      // Optimistic UI
      setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));

      // Kısa animasyon
      setTimeout(() => {
        setSavingAnim((prev) => ({ ...prev, [postId]: false }));
      }, 650);
    } catch (error) {
      console.error("Error toggling saved status:", error);
      setSavingAnim((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <Wrapper>
      <div className={styles.control} data-theme={darkMode ? "dark" : "light"}>
        <h1 className={styles.pageTitle}>{t("allPosts")}</h1>

        {isAdmin && (
          <div style={{ marginBottom: "20px" }}>
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
              <Link to={`/post/${post.id}`}>
                {post.imageUrl && (
                  <img
                    src={`/api${post.imageUrl}`}
                    alt="Post"
                    className={styles.postImage}
                  />
                )}
              </Link>

              <Link to={`/post/${post.id}`} className={styles.postContent}>
                <p className={styles.postAuthor}>
                  <strong>{t("username")}:</strong> {post.author}
                </p>
                <p className={styles.postTitle}>
                  <strong>{t("title")}:</strong> {post.title}
                </p>
                <p className={styles.postText}>
                  <strong>{t("content")}:</strong> {post.content}
                </p>
                <p className={styles.postText}>
                  <strong>{t("category")}</strong>: {post.categoryName || "No category"}
                </p>
                <p className={styles.postDate}>
                  <strong>{t("date")}:</strong>{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </Link>

              <div className={styles.commentSection}>
                <h4 className={styles.commentHeader}>
                  {t("comments")} ({commentsMap[post.id]?.length || 0})
                </h4>
                {Array.isArray(commentsMap[post.id]) &&
                commentsMap[post.id].length > 0 ? (
                  commentsMap[post.id].slice(0, 2).map((com) => (
                    <p key={com.id} className={styles.comment}>
                      <strong className={styles.commentUsername}>
                        {com.username || "User"}:
                      </strong>{" "}
                      {com.comment}
                    </p>
                  ))
                ) : (
                  <p className={styles.noComment}>{t("noComments")}</p>
                )}
              </div>

              <div className={styles.actionButtons}>
                <button
                  onClick={() => handleLike(post.id)}
                  className={styles.likeButton}
                >
                  <img src={Like} alt="Like" />
                  <h2>
                    {t("like")} ({likeCounts[post.id] || 0})
                  </h2>
                </button>

                {/* SAVE TOGGLE – resimsiz, animasyonlu */}
                <button
                  onClick={() => handleSaveToggle(post.id)}
                  className={`${styles.saveButton} ${
                    savedPosts[post.id] ? styles.saved : ""
                  } ${savingAnim[post.id] ? styles.saving : ""}`}
                  aria-pressed={!!savedPosts[post.id]}
                  aria-label={savedPosts[post.id] ? t("noSave") : t("inSave")}
                  disabled={!!savingAnim[post.id]}
                  title={savedPosts[post.id] ? t("noSave") : t("inSave")}
                >
                  <span className={styles.saveIcon} aria-hidden="true" />
                  <span className={styles.saveText}>
                    {savedPosts[post.id] ? t("noSave") : t("inSave")}
                  </span>
                  <span className={styles.sparkles} aria-hidden="true" />
                  <span className={styles.ripple} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.paginationContainer}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`${styles.pageButton} ${
                page === index ? styles.active : ""
              }`}
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