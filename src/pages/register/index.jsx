import React, { useContext, useState } from "react";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css'
import { registerUser } from "../../api";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { darkMode, toggleTheme } = useContext(ThemeContext)
    const { t } = useTranslation();
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
            alert(`${t("username")}: ${username}`);
        } catch (error) {
            console.error("Kayıt başarısız:", error);
        }
    }
    return (
        <Wrapper>

            <div className={styles.control}>
                <h1>{t("register")}</h1>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.usernameArea}>
                            <button type="button" onClick={generateUsername}>
                                {t("generateUsername")}
                            </button>
                            {username && (
                                <p>
                                    {t("username")}: <strong>{username}</strong>
                                </p>
                            )}
                        </div>
                        <input type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">{t("register")}</button>
                    </form>

                </div>
            </div>
        </Wrapper>
    )
}
export default Register;