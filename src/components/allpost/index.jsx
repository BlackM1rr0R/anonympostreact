import React, { useEffect, useState } from "react";
import styles from './index.module.css'
import Wrapper from '../UI/wrapper'
import { getAllPosts } from "../../api";
import { Link } from "react-router-dom";
const AllPosts = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllPosts();
                setData(response);
            }
            catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
        fetchData();
    }, []);
    return (
        <Wrapper>

            <div className={styles.control}>
                <h1>All Posts</h1>
                <div className={styles.controlPosts}>

                    {data.map((param) => (
                        <Link to={`/post/${param.id}`} key={param.id} className={styles.post}>
                            <p><strong>Author:</strong> {param.author}</p>
                            <p><strong>Title:</strong> {param.title}</p>
                            <p>{param.content}</p>
                            <p>{param.createdAt}</p>
                            {param.imageUrl && (
                                <img
                                    src={`http://localhost:6059${param.imageUrl}`}
                                    alt="Post Photo"
                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </Wrapper>
    );
}
export default AllPosts;