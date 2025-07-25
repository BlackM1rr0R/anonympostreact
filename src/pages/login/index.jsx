import React, { useState } from "react";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css'
import { loginUser } from "../../api";
import { useTranslation } from "react-i18next";
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useTranslation();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ username, password });
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            window.location.href="/"
            console.log("Login successful:", response);

        }
        catch (error) {
            console.error("Login failed:", error);
        }
    }
    return (
        <Wrapper>

            <div className={styles.control}>
                <h1>{t("login")}</h1>
                <div className={styles.form}>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder={t("username")} value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder={t("password")} value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <button type="submit">{t("login")}</button>
                    </form>

                </div>
            </div>
        </Wrapper>
    )
}
export default Login;