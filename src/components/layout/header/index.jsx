import React, { useContext, useEffect, useState } from "react";
import styles from "./index.module.css";
import Wrapper from "../../UI/wrapper";
import { Link } from "react-router-dom";
import { searchPostsByTitle } from "../../../api";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/images/673e7d618507b496c9abfece_Studio-Logo 2.png";

const Header = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && isTokenExpired(token)) {
      handleLogOut();
      return;
    }
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) handleLogOut();
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
    if (value.trim().length > 0) {
      try {
        const response = await searchPostsByTitle(value);
        setResults(response);
      } catch {
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <Wrapper>
      <header
        className={`${styles.header} ${darkMode ? styles.dark : styles.light}`}
      >
        <div className={styles.topBarDesktop}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder={t("searchTitle")}
              value={search}
              onChange={handleSearchChange}
            />
            {results.length > 0 && (
              <div className={styles.searchResults}>
                {results.map((post) => (
                  <Link
                    to={`/post/${post.id}`}
                    key={post.id}
                    className={styles.resultItem}
                  >
                    <div className={styles.resultImage}>
                      <img src={`/api${post.imageUrl}` || Logo} alt="" />
                    </div>
                    <div className={styles.resultText}>
                      <h3>{post.title}</h3>
                      <p>
                        {t("by")} {post.author}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className={styles.controls}>
            <button onClick={toggleTheme} className={styles.iconButton}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <select
              onChange={changeLanguage}
              className={styles.select}
              defaultValue={i18n.language}
            >
              <option value="az">Azerbaijan</option>
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="tr">Turkish</option>
              <option value="ru">Russian</option>
            </select>
          </div>
        </div>

        <div className={styles.desktopDivider}></div>
        <div className={styles.bottomBarDesktop}>
          <Link to="/" className={styles.logoLink}>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </Link>
          {user ? (
            <select
              className={styles.select}
              onChange={(e) => {
                if (e.target.value === "myProfile")
                  window.location.href = "/my-profile";
                else if (e.target.value === "logout") handleLogOut();
                else if (e.target.value === "all-saved")
                  window.location.href = "/all-saved";
                else if (e.target.value === "chat")
                  window.location.href = "/chat";
              }}
              defaultValue=""
            >
              <option value="">
                {t("welcome")}, {user.username}
              </option>
              <option value="myProfile">{t("myProfile")}</option>
              <option value="all-saved">{t("allsaved")}</option>
              <option value="chat">{t("Chat")}</option>
              <option value="logout">{t("logout")}</option>
            </select>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login">{t("login")}</Link>
              <span>{t("or")}</span>
              <Link to="/register">{t("register")}</Link>
            </div>
          )}
        </div>
        <div className={styles.topBarMobile}>
          <Link to="/" className={styles.logoLink}>
            <img src={Logo} alt="Logo" className={styles.logo} />
          </Link>
          <button
            className={`${styles.menuToggle} ${menuOpen ? styles.open : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menüyü aç/kapat"
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>

        <div
          className={`${styles.overlay} ${menuOpen ? styles.active : ""}`}
          onClick={() => setMenuOpen(false)}
        />

        <div
          className={`${styles.mobileMenu} ${menuOpen ? styles.active : ""}`}
        >
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
                  <Link
                    to={`/post/${post.id}`}
                    key={post.id}
                    className={styles.resultItem}
                  >
                    <div className={styles.resultImage}>
                      <img src={`/api${post.imageUrl}` || Logo} alt="" />
                    </div>
                    <div className={styles.resultText}>
                      <h3>{post.title}</h3>
                      <p>
                        {t("by")} {post.author}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button onClick={toggleTheme} className={styles.iconButton}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <select
            onChange={changeLanguage}
            className={styles.select}
            defaultValue={i18n.language}
          >
            <option value="az">Azerbaijan</option>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="tr">Turkish</option>
            <option value="ru">Russian</option>
          </select>
          {user ? (
            <>
              <button
                className={styles.menuBtn}
                onClick={() => (window.location.href = "/my-profile")}
              >
                {t("myProfile")}
              </button>
              <button
                className={styles.menuBtn}
                onClick={() => (window.location.href = "/all-saved")}
              >
                {t("allsaved")}
              </button>
              <button
                className={styles.menuBtn}
                onClick={() => (window.location.href = "/chat")}
              >
                {t("Chat")}
              </button>
              <button className={styles.menuBtn} onClick={handleLogOut}>
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.menuBtn}>
                {t("login")}
              </Link>
              <Link to="/register" className={styles.menuBtn}>
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </header>
    </Wrapper>
  );
};

export default React.memo(Header);
