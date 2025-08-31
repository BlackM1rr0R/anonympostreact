import React, { useEffect, useState, useRef, useContext } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import styles from "./index.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const API = "http://localhost:6060";

const Chat = ({ selectedUser }) => {
  const currentUser = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const {darkMode}=useContext(ThemeContext)
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const {t}=useTranslation();
  // Tema: localStorage -> sistem tercihi -> 'light'
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  };
  const [theme, setTheme] = useState(getInitialTheme);

  const messagesEndRef = useRef(null);

  // Eski mesajları getir (yalnızca seçili kullanıcı)
  useEffect(() => {
    setMessages([]);
    if (selectedUser) {
      axios
        .get(`${API}/messages/${encodeURIComponent(selectedUser)}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
        .catch(console.error);
    }
  }, [selectedUser, token]);

  // WebSocket
  useEffect(() => {
    const socket = new SockJS(`${API}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 4000,
      debug: (s) => console.log("STOMP:", s),
      onConnect: () => {
        client.subscribe("/user/queue/messages", (msg) => {
          const data = JSON.parse(msg.body);
          // Yalnızca bu partner ile ilgili olanı ekle
          const matchSelected =
            (data.sender === selectedUser && data.receiver === currentUser) ||
            (data.sender === currentUser && data.receiver === selectedUser);
          if (matchSelected) {
            setMessages((prev) => [...prev, data]);
          }
        });
      },
    });
    client.activate();
    setStompClient(client);
    return () => client.active && client.deactivate();
  }, [selectedUser, currentUser, token]);

  // Yeni mesaj geldiğinde altta tut
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !stompClient?.connected || !selectedUser) return;
    const msgObj = { receiver: selectedUser, content: message.trim() };
    stompClient.publish({
      destination: "/app/private-message",
      body: JSON.stringify(msgObj),
      headers: { Authorization: `Bearer ${token}` },
    });
    // Optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        sender: currentUser,
        receiver: selectedUser,
        content: message.trim(),
        timestamp: new Date().toISOString(),
      },
    ]);
    setMessage("");
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <div
      className={`${styles.chatContainer} ${darkMode ? styles.dark : styles.light}`}
      data-theme={theme}
    >
      <header className={styles.header}>
        <h3 className={styles.title}>{selectedUser} {t("withChat")}</h3>

      </header>

      <div className={styles.messagesContainer}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              m.sender === currentUser ? styles.mine : styles.theirs
            }`}
          >
            {m.sender !== currentUser && <strong className={styles.sender}>{m.sender}: </strong>}
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputBar}>
        <input
          className={styles.input}
          type="text"
          placeholder={t("writeMessage")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          {t("send")}
        </button>
      </div>
    </div>
  );
};

export default Chat;
