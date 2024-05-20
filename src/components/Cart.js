import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CartCSS from "../styles/Cart.module.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navigation from "./Navigation";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const login = decodedToken.sub;

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axiosPrivate.get("/cart");
                setCartItems(response.data);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, [axiosPrivate]);

    const handleRemoveItemClick = async (itemId) => {
        try {
            await axiosPrivate.delete(`/cart/${itemId}`);
            const response = await axiosPrivate.get("/cart");
            setCartItems(response.data);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const handleIncreaseQuantity = async (itemId) => {
        try {
            await axiosPrivate.post(`/cart/increase/${itemId}`);
            const response = await axiosPrivate.get("/cart");
            setCartItems(response.data);
        } catch (error) {
            console.error("Error increasing item quantity:", error);
        }
    };

    const handleDecreaseQuantity = async (itemId) => {
        try {
            await axiosPrivate.post(`/cart/decrease/${itemId}`);
            const response = await axiosPrivate.get("/cart");
            setCartItems(response.data);
        } catch (error) {
            console.error("Error decreasing item quantity:", error);
        }
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            return total + item.productDto.price * item.count;
        }, 0);
    };

    const calculateTotalCount = () => {
        return cartItems.reduce((total, item) => {
            return total + item.count;
        }, 0);
    };

    const handlePayClick = async () => {
        const confirmPayment = window.confirm("Вы уверены, что хотите сделать заказ?");
        if (confirmPayment) {
            try {
                const cartIds = cartItems.map((item) => item.id);
                const body = {
                    cartIds: cartIds,
                    login: login,
                    price: calculateTotalPrice(),
                };
                await axiosPrivate.post("/order/create", body);
                console.log("Payment successful!");
                const response = await axiosPrivate.get("/cart");
                setCartItems(response.data);
            } catch (error) {
                console.error("Error making payment:", error);
            }
        }
    };

    return (
        <div>
            <Navigation />
            <div className={CartCSS}>
                <h1>Корзина</h1>
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.id} className={CartCSS.li}>
                            <div>
                                <div>
                                    <img
                                        src={`http://87.242.102.79:80/product/image/download/${item.productDto.id}`}
                                        alt={item.productDto.title}
                                        className={CartCSS.img}
                                    />
                                </div>
                                <h2>
                                    <Link to={`/product/${item.productDto.id}`}>{item.productDto.title}</Link>
                                </h2>
                                {`${item.productDto.description.slice(0, 10)}...`}
                                <p>Категория: {item.productDto.category}</p>
                                <p>Цена: ${item.productDto.price}</p>
                                <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                                <p>Количество: {item.count}</p>
                                <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                                <button onClick={() => handleRemoveItemClick(item.id)} className={CartCSS.delete}>
                                    X
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className={CartCSS.p}>
                    <strong>Общее количество товаров в корзине: {calculateTotalCount()}</strong>
                </p>
                <p className={CartCSS.p}>
                    <strong>Общая цена: ${calculateTotalPrice()}</strong>
                </p>
                <button onClick={handlePayClick} className={CartCSS.button}>
                    Сделать заказ
                </button>
            </div>
        </div>
    );
};

export default CartPage;
