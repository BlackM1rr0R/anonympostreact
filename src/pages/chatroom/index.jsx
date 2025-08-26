import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const Chat = ({ selectedUser }) => {
  const currentUser = localStorage.getItem("username");
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 👇 BUNU EKLE
  const messagesEndRef = useRef(null);

  // Eski mesajları getir
  useEffect(() => {
    setMessages([]);
    if (selectedUser) {
      axios
        .get(`http://localhost:6060/messages/${selectedUser}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setMessages(res.data))
        .catch(console.error);
    }
  }, [selectedUser]);

  // WebSocket
  useEffect(() => {
    const socket = new SockJS("http://localhost:6060/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      reconnectDelay: 4000,
      debug: (s) => console.log("STOMP:", s),
      onConnect: () => {
        client.subscribe("/user/queue/messages", (msg) => {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [...prev, data]);
        });
      },
    });
    client.activate();
    setStompClient(client);
    return () => client.active && client.deactivate();
  }, []);

  // Kaydırmayı en alta yap
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !stompClient?.connected || !selectedUser) return;
    const msgObj = { receiver: selectedUser, content: message.trim() };
    stompClient.publish({
      destination: "/app/private-message",
      body: JSON.stringify(msgObj),
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    // anında göster
    setMessages((prev) => [
      ...prev,
      { sender: currentUser, receiver: selectedUser, content: message.trim(), timestamp: new Date().toISOString() },
    ]);
    setMessage("");
  };

  return (
    <div style={styles.chatContainer}>
      <h3>{selectedUser} ile sohbet</h3>
      <div style={styles.messagesContainer}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: m.sender === currentUser ? "flex-end" : "flex-start",
              backgroundColor: m.sender === currentUser ? "#4f46e5" : "#e5e7eb",
              color: m.sender === currentUser ? "#fff" : "#111827",
            }}
          >
            {! (m.sender === currentUser) && <strong>{m.sender}: </strong>}
            {m.content}
          </div>
        ))}
        {/* 👇 Kaydırma hedefi */}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          placeholder="Mesaj yaz…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>Gönder</button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingRight: 4,
  },
  message: {
    padding: "10px 12px",
    borderRadius: 10,
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  inputContainer: {
    display: "flex",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
  },
  button: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#10b981",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Chat;
