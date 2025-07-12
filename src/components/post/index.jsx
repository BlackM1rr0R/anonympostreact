import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import Wrapper from '../UI/wrapper';
import { addPost } from '../../api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Post = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || !title.trim()) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("author", user.username);
        if (image) {
            formData.append("image", image);
        }

        try {
            await addPost(formData); // import from api.js
            alert("Post gönderildi!");
            setTitle('');
            setContent('');
            setImage(null);
        } catch (error) {
            console.error("Post gönderilemedi:", error);
        }
    };


    return (
        <Wrapper>
            <div className={styles.control}>
                <h1>Add Your Anonym Post</h1>
                <div className={styles.postCreate}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.input}>
                            <input
                                type="text"
                                placeholder='Your Title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder='Write your post...'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <div className={styles.button}>
                            <button type='submit'>Post</button>
                        </div>
                    </form>

                </div>
            </div>
        </Wrapper>
    );
};

export default Post;
