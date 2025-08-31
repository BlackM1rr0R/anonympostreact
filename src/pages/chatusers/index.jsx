import React, { useState, useEffect, useContext, use } from "react";
import axios from "axios";
import Chat from "../chatroom"; // yolun sende farklıysa düzelt
import Wrapper from "../../components/UI/wrapper";
import styles from "./index.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = "http://localhost:6060";

const ChatUsers = () => {
  const currentUser = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();
  const {t}=useTranslation();
  const [conversations, setConversations] = useState([]); // [{partner, lastMessageAt}]
  const [selectedUser, setSelectedUser] = useState(null);
  const [toUserFromURL, setToUserFromURL] = useState(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches)
      return "dark";
    return "light";
  });

  // STEP 1: URL'deki ?to=USERNAME parametresini al
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const toUser = params.get("to");
    if (toUser) {
      setToUserFromURL(toUser);
      setSelectedUser(toUser);
    }
  }, [location]);

  // STEP 2: Konuşmaları getir, URL'den gelen kullanıcıyı ekle
  useEffect(() => {
    axios
      .get(`${API}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];

        // Eğer URL'den gelen kullanıcı varsa ama listede yoksa, ekle
        const exists = list.some((c) => c.partner === toUserFromURL);
        const finalList = exists
          ? list
          : toUserFromURL
          ? [...list, { partner: toUserFromURL, lastMessageAt: null }]
          : list;

        setConversations(finalList);

        // Eğer hala seçili kullanıcı yoksa, URL'dekini ya da ilkini seç
        if (!selectedUser && finalList.length > 0) {
          setSelectedUser(toUserFromURL || finalList[0].partner);
        }
      })
      .catch((err) => console.error("Konuşma listesi alınamadı:", err));
  }, [token, toUserFromURL]);

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const t = new Date();
    const sameDay =
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear();
    return sameDay
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString();
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const partners = conversations.filter(
    (row) => row.partner && row.partner !== currentUser
  );

  return (
    <Wrapper>
      <div
        className={`${styles.shell} ${darkMode ? styles.dark : ""}`}
        data-theme={darkMode ? "dark" : "light"}
      >
        <div className={styles.container}>
          <aside className={styles.userList}>
            <div className={styles.userListHeader}>
              <h3 className={styles.heading}>{t("allMessages")}</h3>
            </div>

            <div className={styles.userScroll}>
              {partners.length === 0 && (
                <div className={styles.emptySmall}>{t("noMessages")}</div>
              )}

              {partners.map((row) => {
                const active = selectedUser === row.partner;
                return (
                  <button
                    key={row.partner}
                    onClick={() => setSelectedUser(row.partner)}
                    className={`${styles.userItem} ${
                      active ? styles.userItemActive : ""
                    }`}
                    title={row.partner}
                  >
                    <div className={styles.avatar}>
                      {row.partner?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className={styles.userMeta}>
                      <div className={styles.partnerLine}>
                        <span className={styles.userName}>{row.partner}</span>
                        <span className={styles.timeBadge}>
                          {formatTime(row.lastMessageAt)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className={styles.mobileTopbar}>
            <div className={styles.mobileLeft}>
              <label htmlFor="partnerSelect" className={styles.mobileLabel}>
                {t("user")}:
              </label>
              <select
                id="partnerSelect"
                className={styles.mobileSelect}
                value={selectedUser || ""}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {partners.map((p) => (
                  <option key={p.partner} value={p.partner}>
                    {p.partner}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <main className={styles.chatPane}>
            {selectedUser ? (
              <Chat selectedUser={selectedUser} theme={theme} />
            ) : (
              <div className={styles.emptyState}>
                {t("openChat")}
              </div>
            )}
          </main>
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatUsers;
