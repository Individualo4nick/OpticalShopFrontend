import React, { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {jwtDecode} from "jwt-decode";
import Navigation from "./Navigation"
import OrderCSS from "../styles/Order.module.css";

const UserOrder = () => {
    const [orders, setOrders] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const login = decodedToken.sub;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosPrivate.get(`/order/${login}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Navigation/>
            <div className={OrderCSS.container}>
                <h2>Заказы</h2>
                {orders.map((order) => (
                    <div key={order.id} className={OrderCSS.order}>
                        <h3>Заказ номер {order.id}</h3>
                        <p>Дата заказа: {new Date(order.orderDate).toLocaleString()}</p>
                        <p><strong>Статус заказа: {order.orderState}</strong></p>
                        <h4>Товары:</h4>
                        <ul>
                            {order.cartsDto.map(cart => (
                                <li key={cart.id} className={OrderCSS.order}>
                                    <p>Наименование: {cart.productDto.title}</p>
                                    <p>Описание: {cart.productDto.description}</p>
                                    <p>Количество: {cart.count}</p>
                                    <p>Цена: {cart.productDto.price}</p>
                                </li>
                            ))}
                        </ul>
                        <p><strong>Цена: {order.price}</strong></p>
                    </div>
                ))}
            </div>
        </div>
);
};

export default UserOrder;
