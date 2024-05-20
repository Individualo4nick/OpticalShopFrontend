import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { jwtDecode } from "jwt-decode";
import OneProductCSS from '../styles/OneProduct.module.css';
import RedButtonCSS from '../styles/RedButtonStyle.module.css';
import Navigation from "./Navigation";

const ProductPage = () => {
    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [updateFields, setUpdateFields] = useState({
        id: null,
        title: "",
        description: "",
        count: "",
        category: "",
        price: ""
    });
    const [token] = useState(localStorage.getItem('token'));
    const [imageFile, setImageFile] = useState(null);
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    // State for managing favorites
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axiosPrivate.get(`/product/${id}`);
                setProduct(response.data);
                if (response.data) {
                    setUpdateFields({
                        title: response.data.title,
                        description: response.data.description,
                        count: response.data.count,
                        category: response.data.category,
                        price: response.data.price
                    });
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        getProduct();
    }, [axiosPrivate, id]);

    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await axiosPrivate.get(`/product/comment/${id}`);
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        getComments();
    }, [axiosPrivate, id]);

    // Check if the product is in favorites when the component mounts
    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(id)) {
            setIsFavorite(true);
        }
    }, [id]);

    const loggedIn = token !== null;
    let decodedToken = null;
    let roles = [];
    if (loggedIn) {
        decodedToken = jwtDecode(token);
        const roleFromToken = decodedToken.role;
        switch (roleFromToken) {
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
    const isAdmin = roles.includes(5150);

    const handleCommentSubmit = async () => {
        if (!loggedIn) {
            return;
        }

        try {
            const response = await axiosPrivate.post(`/product/comment/${id}`, { login: decodedToken.sub, text: newComment });
            if (response.status === 200) {
                setComments([...comments, response.data]);
            }
            setNewComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axiosPrivate.delete(`/admin/comment/${commentId}`);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleAddToCart = async () => {
        try {
            await axiosPrivate.post(`/product/add/${id}`, { login: decodedToken.sub });
            console.log("Product added to cart successfully");
            const response = await axiosPrivate.get(`/product/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            updateFields.id = id;
            await axiosPrivate.put(`/admin/product`, updateFields);
            if (imageFile) {
                const formData = new FormData();
                formData.append('multipartFile', imageFile);
                await axiosPrivate.post(`/admin/product/image/upload/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axiosPrivate.delete(`/admin/product/image/delete/${id}`);
            }
            const response = await axiosPrivate.get(`/product/${id}`);
            setProduct(response.data);
            window.location.reload();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await axiosPrivate.delete(`/admin/product/${id}`);
            navigate("/product");
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFields(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Toggle favorite status
    const handleToggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(id)) {
            const newFavorites = favorites.filter(favId => favId !== id);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            setIsFavorite(false);
        } else {
            favorites.push(id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorite(true);
        }
    };

    return (
        <div>
            <Navigation />
            <div className={OneProductCSS.container}>
                <div className={OneProductCSS.product}>
                    {product && (
                        <div>
                            <button onClick={handleToggleFavorite} className={OneProductCSS.favoriteButton}>
                                {isFavorite ? '❤️' : '🤍'}
                            </button>
                            <div className={OneProductCSS.productInfo}>
                                <img src={`http://87.242.102.79:80/product/image/download/${product.id}`}
                                     alt={product.title}
                                     className={OneProductCSS.img}/>
                                <div className={OneProductCSS.textContainer}>
                                    <h2>{product.title}</h2>
                                    <p>{product.description}</p>
                                    <p>Количество на складе: {product.count}</p>
                                    <p>Категория: {product.category}</p>
                                    <p>Цена: {product.price}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {isAdmin && (
                    <div>
                        <h3>Обновление продукта:</h3>
                        <input
                            type="text"
                            placeholder="Новое название"
                            name="title"
                            value={updateFields.title}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            placeholder="Новое описание"
                            name="description"
                            value={updateFields.description}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            placeholder="Новое количество"
                            name="count"
                            value={updateFields.count}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            placeholder="Новая категория"
                            name="category"
                            value={updateFields.category}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            placeholder="Новая цена"
                            name="price"
                            value={updateFields.price}
                            onChange={handleInputChange}
                        />
                        <input
                            type="file"
                            accept="image/jpeg"
                            onChange={handleImageChange}
                            className={OneProductCSS.input}
                        />
                        <button onClick={handleUpdateProduct} className={OneProductCSS.button}>Обновить</button>
                    </div>
                )}
                {loggedIn && (
                    <div>
                        <button onClick={handleAddToCart} className={OneProductCSS.button}>Добавить в корзину</button>
                    </div>
                )}
                <h3>Комментарии:</h3>
                <ul className={OneProductCSS.comments}>
                    {comments.map(comment => (
                        <li key={comment.id} className={OneProductCSS.comment}>
                            <p><strong>{comment.fio}</strong>: {comment.text}</p>
                            {isAdmin && (
                                <button onClick={() => handleDeleteComment(comment.id)} className={RedButtonCSS.button}>Удалить</button>
                            )}
                        </li>
                    ))}
                </ul>
                {loggedIn && (
                    <div>
                        <textarea
                            rows="4"
                            cols="50"
                            placeholder="Введите ваш комментарий"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                        <button onClick={handleCommentSubmit} className={OneProductCSS.button}>Отправить</button>
                    </div>
                )}
                {loggedIn && isAdmin && (
                    <div>
                        <button onClick={handleDeleteProduct} className={RedButtonCSS.button}>Удалить продукт</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
