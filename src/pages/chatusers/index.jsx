import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "../chatroom"; // yolun sende farklıysa düzelt

const ChatUsers = () => {
  const currentUser = localStorage.getItem("username");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:6060/user/list-all-users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Kullanıcı listesi alınamadı:", err));
  }, []);

  return (
    <div style={styles.shell}>
      <div style={styles.container}>
        {/* Sol: kullanıcı listesi */}
        <aside style={styles.userList}>
          <div style={styles.userListHeader}>
            <h3 style={{ margin: 0 }}>Kullanıcılar</h3>
          </div>
          <div style={styles.userScroll}>
            {users
              .filter((u) => u.username !== currentUser)
              .map((user) => (
                <button
                  key={user.username}
                  onClick={() => setSelectedUser(user.username)}
                  style={{
                    ...styles.userItem,
                    background:
                      selectedUser === user.username ? "#e5e7eb" : "transparent",
                  }}
                >
                  <div style={styles.avatar}>
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div style={{ fontWeight: 500 }}>{user.username}</div>
                </button>
              ))}
          </div>
        </aside>

        {/* Sağ: chat alanı */}
        <main style={styles.chatPane}>
          {selectedUser ? (
            <Chat selectedUser={selectedUser} />
          ) : (
            <div style={styles.emptyState}>
              Sohbet başlatmak için soldan bir kullanıcı seçin
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  shell: {
    width: "100%",
  },
  container: {
    height: "80vh",                // ≈ tam ekranın %80'i
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    background: "#fff",
  },
  userList: {
    width: 280,
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    minWidth: 240,
    background: "#fafafa",
  },
  userListHeader: {
    padding: "14px 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f5f5f5",
  },
  userScroll: {
    flex: 1,
    overflowY: "auto",
    padding: 8,
    minHeight: 0, // flex child overflow fix
  },
  userItem: {
    width: "100%",
    display: "flex",
    gap: 12,
    alignItems: "center",
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    marginBottom: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#1e40af",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
  },
  chatPane: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0, // flex overflow fix
    background: "#f8fafc",
  },
  emptyState: {
    margin: "auto",
    color: "#6b7280",
    fontSize: 16,
  },
};

export default ChatUsers;
