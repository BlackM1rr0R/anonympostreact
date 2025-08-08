import React, { useContext, useState } from "react";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css';
import { registerUser, loginUser } from "../../api"; // loginUser ekledik
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Logo from '../../assets/images/673e7d618507b496c9abfece_Studio-Logo 2.png';
import { Link } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const { t } = useTranslation();

    const generateUsername = () => {
        const random = Math.random().toString(36).substring(2, 14);
        setUsername(random);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Zəhmət olmasa istifadəçi adı və şifrə daxil edin.");
            return;
        }

        const newUser = {
            username,
            password
        };

        try {
            await registerUser(newUser);
            console.log("Kayıt başarılı.");

            // Otomatik giriş:
            const loginResponse = await loginUser({ username, password });
            localStorage.setItem("token", loginResponse.token);
            localStorage.setItem("user", JSON.stringify(loginResponse));
            alert(`${t("username")}: ${username}`);
            window.location.href = "/";
        } catch (error) {
            console.error("Kayıt veya giriş başarısız:", error);
        }
    };

    return (
        <Wrapper>
            <div className={`${styles.control} ${darkMode ? styles.dark : styles.light}`}>
                <button onClick={toggleTheme} className={styles.toggleButton}>
                    {darkMode ? '☀️' : '🌙 '}
                </button>
                <img src={Logo} alt="Logo" className={styles.logo} />
                <h1 className={styles.welcomeText}>{t("loginWelcome")}</h1>
                <p className={styles.aboutLogin}>Saytın xidmətlərindən istifadə etmək üçün özünə
                    hesab yaratmalısan.</p>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.usernameArea}>
                            <button type="button" onClick={generateUsername}>
                                {t("generateUsername")}
                            </button>
                            {username && (
                                <p className={styles.generatedUsername}>
                                    {t("username")}: <strong>{username}</strong>
                                </p>
                            )}
                        </div>
                        <input type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">{t("register")}</button>
                    </form>
                </div>
                <p>Hesabin var? <Link to="/login">Daxil ol</Link></p>
            </div>
        </Wrapper>
    );
};

export default Register;
