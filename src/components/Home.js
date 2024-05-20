import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import Navigation from "./Navigation";

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        localStorage.removeItem('token')
        setAuth({});
        navigate('/login');
    }

    const products = async () => {
        navigate('/product');
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
                <div className="flexGrow">
                    <button onClick={register}>Регистрация</button>
                </div>
                <div className="flexGrow">
                    <button onClick={login}>Войти</button>
                </div>
                <div className="flexGrow">
                    <button onClick={products}>Список товаров</button>
                </div>
                <div className="flexGrow">
                    <button onClick={logout}>Выйти</button>
                </div>
            </section>
        </div>
    )
}

export default Home
