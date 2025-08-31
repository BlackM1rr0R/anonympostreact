import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  searchPostById,
  allComment,
  getAllPosts,
  addCommentToPost,
  deleteComment,
} from "../../api";
import Wrapper from "../../components/UI/wrapper";
import styles from "./index.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const PostAbout = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [sameTitlePosts, setSameTitlePosts] = useState([]);
  const [addedComment, setAddedComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingComment, setAddingComment] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  // Aktif kullanıcı (localStorage'dan)
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      try {
        const data = await searchPostById(id);
        setPost(data);

        const fetchedComments = await allComment(id);
        setComments(fetchedComments);

        const allPosts = await getAllPosts();
        const filtered = allPosts.filter(
          (p) => p.title === data.title && p.id !== data.id
        );
        setSameTitlePosts(filtered);
      } catch (error) {
        console.error(
          "Error fetching post, comments or same-title posts:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(t("removeComment"));
    if (!confirmed) return;

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error(t("errorRemove"), error);
      alert(t("errorRemove"));
    }
  };

  const handleAddComment = async () => {
    if (!addedComment.trim()) return;
    setAddingComment(true);
    try {
      const newCommentFromServer = await addCommentToPost(id, addedComment);
      setComments((prev) => [...prev, newCommentFromServer]);
      setAddedComment("");
    } catch (error) {
      console.error(t("errorAddComment"), error);
      alert(t("errorAddComment"));
    } finally {
      setAddingComment(false);
    }
  };

  if (loading || !post)
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      <div
        className={`${styles.postWrapper} ${
          darkMode ? styles.dark : styles.light
        }`}
      >
        <div
          className={`${styles.postContainer} ${
            darkMode ? styles.dark : styles.light
          }`}
        >
          <div
            className={styles.postAuthorRow}
            
          >
            <Link
              to={`/about-users/${post.authorId}`}
              className={styles.postAuthor}
            >
              <strong>{t("username")}:</strong> {post.author}
            </Link>
            {user?.username !== post.author && (
              <Link
                to={`/chat?to=${post.author}`}
                className={styles.messageButton}
                style={{
                  padding: "6px 10px",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  background: "var(--card)",
                  color: "var(--text)",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                💬 {t("sendMessage") || "Mesaj yaz"}
              </Link>
            )}
          </div>

          <h1 className={styles.postTitle}>
            <strong>{t("title")}</strong>: {post.title}
          </h1>
          <p className={styles.postContent}>
            <strong>{t("content")}</strong>: {post.content}
          </p>
          <p className={styles.postContent}>
            <strong>{t("category")}</strong>: {post.categoryName}
          </p>

          <div className={styles.postImageWrapper}>
            {post.imageUrl && (
              <img
                src={`/api${post.imageUrl}`}
                alt="Post"
                className={styles.postImage}
              />
            )}
          </div>

          <p className={styles.postDate}>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

          {/* Yorumlar */}
          <div className={styles.commentSection}>
            <h3 className={styles.commentHeader}>
              {t("comments")} ({comments.length})
            </h3>

            {comments.length > 0 ? (
              comments.map((com) => {
                const canDelete =
                  (user?.username && com.username === user.username) ||
                  user?.role === "ADMIN"; // sadece kendi yorumu veya ADMIN
                return (
                  <div key={com.id} className={styles.comment}>
                    <Link to={`/about-users/${com.authorId}`} className={styles.commentUsername}>
                      {com.username || "User"}:
                    </Link>{" "}
                    {com.comment}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(com.id)}
                        className={styles.deleteButton}
                        title={t("removeComments") || "Delete"}
                        aria-label={t("removeComments") || "Delete"}
                      >
                        {t("removeComments") || "Delete"}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p className={styles.noComment}>
                {t("noComments") || "No comments yet."}
              </p>
            )}

            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder={t("addYourComment")}
                value={addedComment}
                onChange={(e) => setAddedComment(e.target.value)}
                disabled={addingComment}
                className={styles.commentInput}
              />
              <button
                onClick={handleAddComment}
                disabled={addingComment || !addedComment.trim()}
                className={styles.commentButton}
              >
                {addingComment ? "Adding..." : t("add")}
              </button>
            </div>
          </div>

          {sameTitlePosts.length > 0 && (
            <div className={styles.sameTitleSection}>
              <h3 className={styles.sameTitleHeader}>
                {t("otherPostByTitle")}:
              </h3>
              <ul className={styles.sameTitleList}>
                {sameTitlePosts.map((post) => (
                  <li key={post.id} className={styles.sameTitleCard}>
                    <Link
                      to={`/post/${post.id}`}
                      className={styles.sameTitleLink}
                    >
                      <div className={styles.cardInner}>
                        <div className={styles.cardFront}>
                          {post.imageUrl ? (
                            <img
                              src={`/api${post.imageUrl}`}
                              alt="Post"
                              className={styles.sameTitleImage}
                            />
                          ) : (
                            <div className={styles.noImage}>No Image</div>
                          )}
                          <h4 className={styles.cardTitle}>
                            {t("title")}: {post.title}
                          </h4>
                          <p className={styles.cardAuthor}>
                            {t("username")}: {post.author}
                          </p>
                        </div>
                        <div className={styles.cardBack}>
                          <p className={styles.cardContent}>
                            {post.content.length > 120
                              ? post.content.slice(0, 120) + "..."
                              : post.content}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default PostAbout;
