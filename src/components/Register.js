import React, { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import RegisterCSS from "../styles/Register.module.css"
import Navigation from "./Navigation";

const Register = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post("/auth/registration", {
                login,
                password
            });

            console.log("Registration successful:", response.data);
            navigate("/login");
            // Дополнительные действия после успешной регистрации, например, перенаправление на другую страницу
        } catch (error) {
            console.error("Registration error:", error.response.data);
            setError(error.response.data.message || "Ошибка регистрации");
        }
    };

    return (
        <div>
            <Navigation/>
            <div className={RegisterCSS.div}>
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Имя пользователя:</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit" className={RegisterCSS.button}>Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
