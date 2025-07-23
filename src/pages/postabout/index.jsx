import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { searchPostById, allComment, getAllPosts, addCommentToPost } from "../../api"; // addCommentToPost API fonksiyonunu eklemelisin
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css';
import { ThemeContext } from "../../context/ThemeContext"; 
const PostAbout = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [sameTitlePosts, setSameTitlePosts] = useState([]);
  const [addedComment, setAddedComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingComment, setAddingComment] = useState(false);
  const {darkMode,toggleTheme}=useContext(ThemeContext);
  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      try {
        const data = await searchPostById(id);
        setPost(data);

        const fetchedComments = await allComment(id);
        setComments(fetchedComments);

        const allPosts = await getAllPosts();
        const filtered = allPosts.filter(p => p.title === data.title && p.id !== data.id);
        setSameTitlePosts(filtered);
      } catch (error) {
        console.error("Error fetching post, comments or same-title posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!addedComment.trim()) return;
    setAddingComment(true);
    try {
      const newCommentFromServer = await addCommentToPost(id, addedComment);
      setComments(prev => [...prev, newCommentFromServer]);
      setAddedComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Yorum eklenirken hata oluştu.");
    } finally {
      setAddingComment(false);
    }
  };


  if (loading || !post) return <Wrapper><p>Loading...</p></Wrapper>;

return (
  <Wrapper>
    <div className={`${styles.postContainer} ${darkMode ? styles.dark : styles.light}`}>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <p className={styles.postAuthor}><strong>Author:</strong> {post.author}</p>
      <p className={styles.postContent}>{post.content}</p>

      {post.imageUrl && (
        <img
          src={`http://localhost:6060${post.imageUrl}`}
          alt="Post"
          className={styles.postImage}
        />
      )}

      <p className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</p>

      {/* Yorumlar */}
      <div className={styles.commentSection}>
        <h3 className={styles.commentHeader}>Comments ({comments.length})</h3>
        {comments.length > 0 ? (
          comments.map((com) => (
            <p key={com.id} className={styles.comment}>
              <strong className={styles.commentUsername}>{com.username || "User"}:</strong> {com.comment}
            </p>
          ))
        ) : (
          <p className={styles.noComment}>No comments yet.</p>
        )}

        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Add your comment"
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
            {addingComment ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* Aynı başlıklı postlar */}
      {sameTitlePosts.length > 0 && (
        <div className={styles.sameTitleSection}>
          <h3 className={styles.sameTitleHeader}>Other posts with the same title:</h3>
          <ul className={styles.sameTitleList}>
            {sameTitlePosts.map(post => (
              <li key={post.id} className={styles.sameTitleCard}>
                <Link to={`/post/${post.id}`} className={styles.sameTitleLink}>
                  <div className={styles.cardInner}>
                    <div className={styles.cardFront}>
                      {post.imageUrl ? (
                        <img
                          src={`http://localhost:6059${post.imageUrl}`}
                          alt="Post"
                          className={styles.sameTitleImage}
                        />
                      ) : (
                        <div className={styles.noImage}>No Image</div>
                      )}
                      <h4 className={styles.cardTitle}>{post.title}</h4>
                      <p className={styles.cardAuthor}>By {post.author}</p>
                    </div>
                    <div className={styles.cardBack}>
                      <p className={styles.cardContent}>
                        {post.content.length > 120 ? post.content.slice(0, 120) + "..." : post.content}
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
  </Wrapper>
);

};

export default PostAbout;
