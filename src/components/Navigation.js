import React from 'react';
import {jwtDecode} from "jwt-decode";
import NavigationCSS from '../styles/Navigation.module.css';

const Navigation = () => {
    const token = localStorage.getItem('token');
    const loggedIn = token !== null;
    let roles = [];
    if (loggedIn){
        const decodedToken = jwtDecode(token);
        const roleUser = decodedToken.role;
        switch (roleUser) {
            case 'ADMIN':
                roles.push(5150);
                break;
            case 'USER':
                roles.push(2001);
                break;
            default:
                roles = [0];
        }
    }

    return (
        <nav className={NavigationCSS.navigation}>
            <ul>
                {!loggedIn && (
                    <li>
                        <div><a href="/login">Войти</a></div>
                    </li>
                )}
                {!loggedIn && (
                    <li>
                        <div><a href="/register">Зарегистрироваться</a></div>
                    </li>
                )}
                <li>
                    <div><a href="/product">Список товаров</a></div>
                </li>
                {roles.includes(2001) && (
                    <li>
                        <div><a href="/cart">Корзина</a></div>
                    </li>
                )}
                <li>
                    <div><a href="/favorites">Избранное</a></div>
                </li>
                {roles.includes(2001) && (
                    <li>
                        <div><a href="/user">Профиль</a></div>
                    </li>
                )}
                {roles.includes(2001) && (
                    <li>
                        <div><a href="/order">Заказы</a></div>
                    </li>
                )}
                {roles.includes(5150) && (
                    <li>
                        <div><a href="/admin/product/create">Создать товар</a></div>
                    </li>
                )}
                {roles.includes(5150) && (
                    <li>
                        <div><a href="/admin/order">Все заказы</a></div>
                    </li>
                )}
                <li>
                    <div><a href="/">Домашняя страница</a></div>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
