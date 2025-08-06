import React, { useEffect, useState } from "react";
import {
  adminAddNewUser,
  adminDeletePost,
  adminDeleteUser,
  adminEditPost,
  adminEditProfile,
  adminGetAllPosts,
  adminGetAllUsers,
} from "../../api";
import styles from "./index.module.css";

const AdminPage = () => {
  //For all users and editing;
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
 //For all posts and editing;
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  //For adding new user;
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState("USER");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    //Come allUsers and allPosts;
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      //Come all users from the API;
      const allUsers = await adminGetAllUsers();
      setUsers(allUsers);


    } catch (error) {
      console.error("Error fetching users or posts:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      //Come all posts from the API;
      const allPosts = await adminGetAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error("Postlar çekilemedi:", error);
    }
  };

  const handleRemovePost = async (postId) => {
    try {
      //Delete post by ID;
      await adminDeletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = (postId) => {
    //Find the post to edit by ID; Post have oben;
    const postToEdit = posts.find((p) => p.id === postId);
    if (postToEdit) {
      setEditPost(postToEdit);
      setEditedTitle(postToEdit.title);
      setEditedContent(postToEdit.content);
    }
  };

  const handleEditPostSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit tetiklendi")
    try { //Object gonderir
      const updatedPost = {
        id: editPost.id, // Düzenlenen postun ID'si
        title: editedTitle, // Düzenlenen başlık
        content: editedContent, // Düzenlenen içerik
      };
      await adminEditPost(editPost.id, updatedPost);
      setEditPost(null); // Edit formunu kapat
      fetchUsers(); // reload users
      fetchPosts(); // reload posts
    } catch (error) {
      console.error("Post güncellenemedi:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteUser(id); // ID’ye göre kullanıcıyı siler
      fetchUsers(); // Kullanıcı listesini yeniden çeker
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user); // Düzenlenecek kullanıcıyı state'e atar
    setEditedUsername(user.username); // Form için username'i doldurur
    setEditedRole(typeof user.roles === "string" ? user.roles : user.roles[0]);  // Rol bilgisi string değilse, ilk rolü alır
    setEditedPassword("");     // Şifre alanı boş başlatılır
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        id: editUser.id,
        username: editedUsername,
        role: editedRole,
        password: editedPassword,
      };
      await adminEditProfile(updatedUser); // Güncellenmiş kullanıcı bilgilerini API’ye gönderir
      setEditUser(null);    // Formu kapatır
      fetchUsers(); // Güncellenmiş kullanıcıları yeniden yükler
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const newUser = {
              username: newUsername,
              role: newRole,
              password: newPassword,
            };
            await adminAddNewUser(newUser);
            setNewUsername("");
            setNewRole("USER");
            setNewPassword("");
            fetchUsers();
            alert("Yeni kullanıcı eklendi.");
          } catch (error) {
            alert("Kullanıcı eklenemedi.");
          }
        }}
        className={styles.editForm}
      >
        <h3>Yeni Kullanıcı Ekle</h3>
        <label>
          Kullanıcı Adı:
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Rol:
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>
        <label>
          Şifre:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Ekle</button>
      </form>

      {editUser && (
        <form onSubmit={handleEditSubmit} className={styles.editForm}>
          <h3>Kullanıcıyı Düzenle</h3>
          <label>
            Username:
            <input
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
            />
          </label>
          <label>
            Role:
            <select
              value={editedRole}
              onChange={(e) => setEditedRole(e.target.value)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <label>
            Password:
            <input
              type="password"
              value={editedPassword}
              onChange={(e) => setEditedPassword(e.target.value)}
            />
          </label>
          <button type="submit">Kaydet</button>
          <button onClick={() => setEditUser(null)} type="button">
            İptal
          </button>
        </form>
      )}

      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kullanıcı Adı</th>
            <th>Rol</th>
            <th>IP</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{typeof u.roles === "string" ? u.roles : u.roles[0]}</td>
              <td>{u.ipAddress || "-"}</td>
              <td>
                <button
                  className={`${styles.actionButton} ${styles.edit}`}
                  onClick={() => handleEditClick(u)}
                >
                  Düzenle
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDelete(u.id)}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className={styles.title}>Postlar</h2>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Başlık</th>
            <th>Yazar</th>
            <th>İçerik</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>{p.author}</td>
                <td>{p.content}</td>
                <td>
                  <button onClick={() => handleEditPost(p.id)}>Düzenle</button>
                  <button onClick={() => handleRemovePost(p.id)}>Sil</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Hiç post bulunamadı.</td>
            </tr>
          )}
        </tbody>
      </table>

      {editPost && (
        <form onSubmit={handleEditPostSubmit} className={styles.editForm}>
          <h3>Postu Düzenle</h3>
          <label>
            Başlık:
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </label>
          <label>
            İçerik:
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </label>
          <button type="submit">Kaydet</button>
          <button onClick={() => setEditPost(null)} type="button">
            İptal
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPage;
