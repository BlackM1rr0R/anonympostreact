import React, { useEffect, useState } from "react";
import styles from './index.module.css'
import Wrapper from '../UI/wrapper'
import { allComment, getAllLikes, getAllPosts, toggleLike } from "../../api";
import { Link } from "react-router-dom";

const AllPosts = () => {
  const [data, setData] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getAllPosts();
        setData(posts);

        const commentResults = {};
        const likeCountsObj = {};
        for (const post of posts) {
          const comments = await allComment(post.id);
          commentResults[post.id] = comments;

          const likeCount = await getAllLikes(post.id);
          likeCountsObj[post.id] = likeCount;
        }

        setCommentsMap(commentResults);
        setLikeCounts(likeCountsObj); // BU SATIR EKLENDİ
      } catch (error) {
        console.error("Error fetching posts or comments:", error);
      }
    };

    fetchData();
  }, []);


  const handleLike = async (postId) => {
    try {
      const isLiked = await toggleLike(postId);
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: isLiked
          ? (prev[postId] || 0) + 1    // like eklendi
          : Math.max((prev[postId] || 1) - 1, 0) // like kaldırıldı
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };


  return (
    <Wrapper>
      <div className={styles.control}>
        <h1 className={styles.pageTitle}>All Posts</h1>
        <div className={styles.controlPosts}>
          {data.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <Link to={`/post/${post.id}`} className={styles.postContent}>
                <p className={styles.postAuthor}><strong>Author:</strong> {post.author}</p>
                <p className={styles.postTitle}><strong>Title:</strong> {post.title}</p>
                <p className={styles.postText}>{post.content}</p>
                <p className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</p>

                {post.imageUrl && (
                  <img
                    src={`http://localhost:6059${post.imageUrl}`}
                    alt="Post"
                    className={styles.postImage}
                  />
                )}
              </Link>

              <div className={styles.commentSection}>
                <h4 className={styles.commentHeader}>Comments ({commentsMap[post.id]?.length || 0})</h4>
                {Array.isArray(commentsMap[post.id]) && commentsMap[post.id].length > 0 ? (
                  commentsMap[post.id].slice(0, 2).map((com) => (
                    <p key={com.id} className={styles.comment}>
                      <strong className={styles.commentUsername}>{com.username || "User"}:</strong> {com.comment}
                    </p>
                  ))
                ) : (
                  <p className={styles.noComment}>No comments yet.</p>
                )}
              </div>
              <button
                onClick={() => handleLike(post.id)}
                className={styles.likeButton}
              >
                ❤️ Like ({Array.isArray(likeCounts[post.id]) ? likeCounts[post.id].length : likeCounts[post.id] || 0})
              </button>

            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default AllPosts;
