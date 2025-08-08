// En üst importlar arasında kalsın
import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import Wrapper from "../../UI/wrapper";
import { Link } from "react-router-dom";
import { searchPostsByTitle } from "../../../api";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Logo from '../../../assets/images/673e7d618507b496c9abfece_Studio-Logo 2.png'

const Header = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);



  const changeLanguage = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
  };

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() > expiry;
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login";
      }
    }, 60000);

    return () => clearInterval(interval);
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
      <div className={`${styles.control} ${darkMode ? styles.dark : styles.light}`}>
        <div className={styles.leftSide}>
          <Link to={"/"}>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        {/* Hamburger Button for Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.hamburgerButton}
        >
          ☰
        </button>

        {/* Desktop menu */}
        <div className={styles.middleSide}>
          <input
            type="text"
            placeholder={t('searchTitle')}
            value={search}
            onChange={handleSearchChange}
          />
          {results.length > 0 && (
            <div className={styles.searchResults}>
              {results.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id} className={styles.resultItem}>
                  <div className={styles.resultContent}>
                    <h3>{post.title}</h3>
                    <p className={styles.resultAuthor}>By {post.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.rightSide}>
          <button onClick={toggleTheme} className={styles.toggleButton}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          <select
            onChange={changeLanguage}
            className={styles.languageSelect}
            defaultValue={i18n.language}
          >
            <option value="az">Azerbaijan</option>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="tr">Turkish</option>
          </select>

          {user ? (
            <select className={styles.userMenu}
              onChange={e => {
                if (e.target.value === "myProfile") {
                  window.location.href = "/my-profile";
                } else if (e.target.value === "logout") {
                  handleLogOut();
                }
              }}
              defaultValue=""
            >
              <option value="">{t("welcome")}, {user.username}</option>
              <option value="myProfile">{t("myProfile")}</option>
              <option value="logout">{t("logout")}</option>
            </select>
          ) : (
            <>
              <Link to={"/login"} className={styles.loginButton}>{t('login')}</Link>
              <span>{t('or')}</span>
              <Link to={"/register"} className={styles.registerButton}>{t('register')}</Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {/* MOBILE MENU */}
        {menuOpen && (
          <div className={`${styles.mobileMenu} ${menuOpen ? styles.active : ""}`}>
            <div className={styles.mobileSearch}>
              <input
                type="text"
                placeholder={t("searchTitle")}
                value={search}
                onChange={handleSearchChange}
              />
              {results.length > 0 && (
                <div className={styles.searchResults}>
                  {results.map((post) => (
                    <Link to={`/post/${post.id}`} key={post.id} className={styles.resultItem}>
                      <div className={styles.resultContent}>
                        <h3>{post.title}</h3>
                        <p className={styles.resultAuthor}>By {post.author}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.mobileOptions}>
              <button onClick={toggleTheme} className={styles.toggleButton}>
                {darkMode ? "☀️" : "🌙"}
              </button>

              <select
                onChange={changeLanguage}
                className={styles.languageSelect}
                defaultValue={i18n.language}
              >
                <option value="tr">Türkçe</option>
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </select>

              {user ? (
                <select
                  className={styles.userMenu}
                  onChange={(e) => {
                    if (e.target.value === "myProfile") {
                      window.location.href = "/my-profile";
                    } else if (e.target.value === "logout") {
                      handleLogOut();
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">{t("welcome")}, {user.username}</option>
                  <option value="myProfile">{t("myProfile")}</option>
                  <option value="logout">{t("logout")}</option>
                </select>
              ) : (
                <>
                  <Link to="/login" className={styles.loginButton}>{t("login")}</Link>
                  <span>{t("or")}</span>
                  <Link to="/register" className={styles.registerButton}>{t("register")}</Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </Wrapper>
  );
};

export default React.memo(Header);
