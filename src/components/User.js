import React, { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UserCSS from "../styles/User.module.css";
import Navigation from "./Navigation";

const UserPage = () => {
    const [userData, setUserData] = useState({
        login: "",
        email: null,
        name: null,
        surname: null,
        address: null
    });
    const [updatedData, setUpdatedData] = useState({
        email: "",
        name: "",
        surname: "",
        address: ""
    });
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosPrivate.get('/user');
                setUserData(response.data);
                setUpdatedData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData({ ...updatedData, [name]: value });
    };

    const handleUpdateUser = async () => {
        try {
            await axiosPrivate.put('/user', updatedData);
            // Обновляем информацию о пользователе после успешного обновления на сервере
            const response = await axiosPrivate.get('/user');
            setUserData(response.data);
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    return (
        <div>
            <Navigation/>
            <div className={UserCSS.div}>
                <h1 className={UserCSS.h1}>Профиль</h1>
                <p className={UserCSS.p}><strong>Имя пользователя:</strong> {userData.login}</p>
                <p className={UserCSS.p}><strong>Email:</strong> {userData.email || "Не найдено"}</p>
                <p className={UserCSS.p}><strong>Имя:</strong> {userData.name || "Не найдено"}</p>
                <p className={UserCSS.p}><strong>Фамилия:</strong> {userData.surname || "Не найдено"}</p>
                <p className={UserCSS.p}><strong>Адрес:</strong> {userData.address || "Не найдено"}</p>
                <label className={UserCSS.label}>
                    Email:
                    <input
                        type="text"
                        name="email"
                        value={updatedData.email}
                        onChange={handleInputChange}
                        className={UserCSS.input}
                    />
                </label>
                <label className={UserCSS.label}>
                    Имя:
                    <input
                        type="text"
                        name="name"
                        value={updatedData.name}
                        onChange={handleInputChange}
                        className={UserCSS.input}
                    />
                </label>
                <label className={UserCSS.label}>
                    Фамилия:
                    <input
                        type="text"
                        name="surname"
                        value={updatedData.surname}
                        onChange={handleInputChange}
                        className={UserCSS.input}
                    />
                </label>
                <label className={UserCSS.label}>
                    Адрес:
                    <input
                        type="text"
                        name="address"
                        value={updatedData.address}
                        onChange={handleInputChange}
                        className={UserCSS.input}
                    />
                </label>
                <button onClick={handleUpdateUser}>Обновить</button>
            </div>
        </div>
    );
};
export default UserPage;
