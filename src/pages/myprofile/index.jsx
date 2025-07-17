import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import Wrapper from '../../components/UI/wrapper';
import { getMyPosts, editPost, myProfile } from '../../api';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await myProfile();
        console.log("Profile data:", profileData); 
        setUser(profileData);
        const response = await getMyPosts();
        setPosts(response);
      } catch (error) {
        console.error("Error fetching profile or posts:", error);
      }
    };

    fetchData();
  }, []);


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
      <div className={styles.profile}>
        <h1>My Profile</h1>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>IP-Adress:</strong> {user.ip}</p>
        <p><strong>Password:</strong> <button>Edit</button></p>
        {user.createdAt && (
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        )}

        <h2>My Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className={styles.myPost}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p><strong>Author:</strong> {post.author}</p>
              {post.imageUrl && (
                <img
                  src={`http://localhost:6059${post.imageUrl}`}
                  alt="My Post"
                  style={{ maxWidth: '300px', marginTop: '10px' }}
                />
              )}
              <button onClick={() => handleEdit(post)}>Edit</button>

              {/* Sadece bu post düzenleniyorsa göster */}
              {editingPost?.id === post.id && (
                <div className={styles.editForm}>
                  <h4>Edit This Post</h4>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="New title"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="New content"
                  />
                  <div style={{ marginTop: '10px' }}>
                    <button onClick={handleUpdate}>Save</button>
                    <button
                      onClick={() => setEditingPost(null)}
                      style={{ marginLeft: '10px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </Wrapper>
  );
};

export default MyProfile;
