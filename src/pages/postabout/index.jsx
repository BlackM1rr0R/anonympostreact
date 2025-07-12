import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { searchPostById } from "../../api";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css';

const PostAbout = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await searchPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <Wrapper><p>Loading...</p></Wrapper>;

  return (
    <Wrapper>
      <div className={styles.postContainer}>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.postAuthor}><strong>Author:</strong> {post.author}</p>
        <p className={styles.postContent}>{post.content}</p>
        {post.imageUrl && (
          <img
            src={`http://localhost:6059${post.imageUrl}`}
            alt="Post"
            className={styles.postImage}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default PostAbout;
