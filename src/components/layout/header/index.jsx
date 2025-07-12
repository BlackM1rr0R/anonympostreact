import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Wrapper from "../../UI/wrapper";
import { Link } from "react-router-dom";
import { searchPostsByTitle } from "../../../api";


const Header = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim().length > 1) {
      try {
        const response = await searchPostsByTitle(value);
        setResults(response);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <Wrapper>
      <div className={styles.control}>
        <div className={styles.leftSide}>
          <Link to={"/"}>FormDom</Link>
        </div>

        <div className={styles.middleSide}>
          <input
            type="text"
            placeholder="Search title"
            value={search}
            onChange={handleSearchChange}
          />
          {results.length > 0 && (
            <div className={styles.searchResults}>
              {results.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id} className={styles.resultItem}>
                  <p><strong>{post.title}</strong></p>
                  <p style={{ fontSize: '12px' }}>{post.author}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.rightSide}>
          {user ? (
            <div>
              <h2>Welcome, {user.username}</h2>
              <Link to={"/my-profile"}>My Profile</Link>
              <h2 onClick={handleLogOut}>LogOut</h2>
            </div>
          ) : (
            <>
              <Link to={"/login"} className={styles.loginButton}>
                Login
              </Link>
              <span>or</span>
              <Link to={"/register"} className={styles.registerButton}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(Header);
