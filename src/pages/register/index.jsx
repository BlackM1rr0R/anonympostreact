import React, { useContext, useState } from "react";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css'
import { registerUser } from "../../api";
import { ThemeContext } from "../../context/ThemeContext";
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { darkMode, toggleTheme } = useContext(ThemeContext)
    const generateUsername = () => {
        const random = Math.random().toString(36).substring(2, 14);
        setUsername(random);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username) {
            alert("Please write username.");
            return;
        }
        const newUser = {
            username,
            password
        };
        try {
            const response = await registerUser(newUser);
            console.log("Kayıt başarılı:", response);
            alert(`Kayıt başarılı. Kullanıcı adın: ${username}`);
        } catch (error) {
            console.error("Kayıt başarısız:", error);
        }
    }
    return (
        <Wrapper>

            <div className={styles.control}>
                <h1>Register Page</h1>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.usernameArea}>
                            <button type="button" onClick={generateUsername}>
                                Generate Username
                            </button>
                            {username && (
                                <p>
                                    Kullanıcı adınız: <strong>{username}</strong>
                                </p>
                            )}
                        </div>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">Register</button>
                    </form>

                </div>
            </div>
        </Wrapper>
    )
}
export default Register;