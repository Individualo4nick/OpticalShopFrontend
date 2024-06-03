import { useNavigate } from "react-router-dom";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthProvider";
import Navigation from "./Navigation";
import HomeCSS from "../styles/Home.module.css";

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token'));

    const logout = async () => {
        localStorage.removeItem('token')
        setAuth({});
        navigate('/login');
    }
    const loggedIn = token !== null;

    const products = async () => {
        navigate('/product');
    }

    const profile = async () => {
        navigate('/user');
    }

    const cart = async () => {
        navigate('/cart');
    }

    const login = async () => {
        navigate('/login');
    }

    const register = async () => {
        navigate('/register');
    }

    return (
        <div>
            <Navigation/>
            <section>
                <h1>Добро пожаловать в магазин оптики "ПроЗрение"</h1>
                {!loggedIn && (
                    <div className="flexGrow">
                        <button onClick={register} className={HomeCSS.button}>Регистрация</button>
                    </div>
                )}
                {!loggedIn && (
                    <div className="flexGrow">
                        <button onClick={login} className={HomeCSS.button}>Войти</button>
                    </div>
                )}
                <div className="flexGrow">
                    <button onClick={products} className={HomeCSS.button}>Список товаров</button>
                </div>
                {loggedIn && (
                    <div className="flexGrow">
                        <button onClick={cart} className={HomeCSS.button}>Корзина</button>
                    </div>
                )}
                {loggedIn && (
                    <div className="flexGrow">
                        <button onClick={profile} className={HomeCSS.button}>Профиль</button>
                    </div>
                )}
                {!loggedIn && (
                    <div className="flexGrow">
                        <button onClick={logout} className={HomeCSS.button}>Выйти</button>
                    </div>
                )}
            </section>
        </div>
    )
}

export default Home
