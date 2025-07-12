import React, { useState } from "react";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css'
import { loginUser } from "../../api";
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                <h1>Login Page</h1>
                <div className={styles.form}>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <button type="submit">Login</button>
                    </form>

                </div>
            </div>
        </Wrapper>
    )
}
export default Login;