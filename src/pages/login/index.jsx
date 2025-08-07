import React, { useContext, useState } from "react";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css'
import { loginUser } from "../../api";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Logo from '../../assets/images/673e7d618507b496c9abfece_Studio-Logo 2.png'
import { Link } from "react-router-dom";
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { darkMode, toggleTheme } = useContext(ThemeContext)
    const { t } = useTranslation();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ username, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            window.location.href = "/"
            console.log("Login successful:", response);

        }
        catch (error) {
            console.error("Login failed:", error);
        }
    }
    return (
        <Wrapper>

            <div className={`${styles.control} ${darkMode ? styles.dark : styles.light}`}>
                <button onClick={toggleTheme} className={styles.toggleButton}>
                    {darkMode ? '☀️' : '🌙 '}
                </button>
                <img src={Logo} alt="Logo" className={styles.logo} />
                <h1 className={styles.welcomeText}>{t("loginWelcome")}</h1>
                <p className={styles.aboutLogin}>Saytın xidmətlərindən istifadə etmək üçün
                    hesabına daxil olmalısan.</p>
                <div className={styles.form}>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder={t("username")} value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Link to={""}>Şifrəmi unutdum 😞</Link>
                        <button type="submit">{t("login")}</button>
                    </form>

                </div>
                <p className={styles.registerLink}>Hesabin yoxdur? <Link to={"/register"}>Qeydiyyatdan kec</Link></p>
            </div>
        </Wrapper>
    )
}
export default Login;