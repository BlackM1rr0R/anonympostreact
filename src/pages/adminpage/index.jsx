import React, { useEffect, useState } from "react";
import { adminDeleteUser, adminEditProfile, adminGetAllUsers, deleteUser, editProfile } from "../../api"; // API metotlarını buna göre düzenle
import styles from './index.module.css'
const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const allUsers = await adminGetAllUsers();
      setUsers(allUsers);
      console.log("Fetched users:", allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteUser(id); 
      fetchUsers(); 
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleEditClick = (user) => {
    setEditUser(user);
    setEditedUsername(user.username);
    setEditedRole(typeof user.roles === "string" ? user.roles : user.roles[0]);
    setEditedPassword("");
  };


const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    const updatedUser = {
      id: editUser.id,
      username: editedUsername,
      role: editedRole,
      password: editedPassword
    };
    await adminEditProfile(updatedUser);
    setEditUser(null);
    fetchUsers();
  } catch (error) {
    console.error("Error updating user:", error);
  }
};


  return (
  <div className={styles.container}>
    <h1 className={styles.title}>Admin Panel</h1>

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
  </div>
);
};

export default AdminPage;
