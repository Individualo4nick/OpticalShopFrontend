import React, { useState, useEffect } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import OrderCSS from "../styles/Order.module.css";
import Navigation from "./Navigation";

const AllOrder = () => {
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosPrivate.get(`/order`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = async (orderId) => {
        try {
            await axiosPrivate.put('/admin/order', {
                orderId: orderId,
                orderState: selectedStatus
            });
            // После обновления статуса можно перезагрузить список заказов
            const response = await axiosPrivate.get(`/order`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div>
            <Navigation/>
            <div className={OrderCSS.container}>
                <h2>Заказы</h2>
                {orders.map(order => (
                    <div key={order.id} className={OrderCSS.order}>
                        <h3>Номер заказа: {order.id}</h3>
                        <p>Цена: {order.price}</p>
                        <p>Дата заказа: {new Date(order.orderDate).toLocaleString()}</p>
                        <p><strong>Статус заказа: {order.orderState}</strong></p>
                        <div> {/* Добавляем блок для выбора статуса и кнопки */}
                            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                <option value="">Выберите статус</option>
                                <option value="NEW">ПРИНЯТ</option>
                                <option value="DELIVERED">ДОСТАВЛЕН</option>
                                <option value="COMPLETED">ЗАВЕРШЕН</option>
                                <option value="CANCELED">ОТМЕНЕН</option>
                            </select>
                            <button onClick={() => handleStatusChange(order.id)} className={OrderCSS.button}>Изменить статус</button>
                        </div>
                        <h4>Товары:</h4>
                        <ul>
                            {order.cartsDto.map(cart => (
                                <li key={cart.id}>
                                    <p>Наименование: {cart.productDto.title}</p>
                                    <p>Описание: {cart.productDto.description}</p>
                                    <p>Количество на складе: {cart.count}</p>
                                    <p>Цена: {cart.productDto.price}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllOrder;
