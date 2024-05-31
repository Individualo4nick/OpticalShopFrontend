import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AllProductCSS from '../styles/AllProduct.module.css'
import Navigation from "./Navigation";

const FavoritesProducts = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [category, setCategory] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getProducts = async () => {
            try {
                console.log(localStorage.getItem('favorites'))
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                const response = await axiosPrivate.post(`/product/favorites?category=${category}&page=${page}&size=${size}`, {
                    ids: favorites
                });
                isMounted && setProducts(response.data.content);
                isMounted && setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getProducts();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [page, size, category])

    const handlePageChange = (newPage) => {
        setPage(newPage);
    }

    const handleSizeChange = (event) => {
        setSize(parseInt(event.target.value));
        setPage(1);
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setPage(1);
    }

    return (
        <div>
            <Navigation/>
            <article className={AllProductCSS.article}>
                <h2 className={AllProductCSS.h2}>Избранное:</h2>
                <div className={AllProductCSS.div}>
                    <label htmlFor="category" className={AllProductCSS.label}>Категория:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={handleCategoryChange}
                        className={AllProductCSS.input}
                    />
                </div>
                {products.length > 0 ? (
                    <>
                        <ul className={AllProductCSS.ul}>
                            {products.map(product => (
                                <li key={product.id} className={AllProductCSS.li}>
                                    <div className={AllProductCSS.productInfo}>
                                        <div>
                                            <img src={`http://192.144.14.39:80/product/image/download/${product.id}`} alt={product.title} className={AllProductCSS.img}/>
                                        </div>
                                        <div className={AllProductCSS.productDetails}>
                                            <h3>
                                                <Link to={`/product/${product.id}`}>{product.title}</Link>
                                            </h3>
                                            <p className={AllProductCSS.p}>{product.description}</p>
                                            <p className={AllProductCSS.p}>Количество: {product.count}</p>
                                            <p className={AllProductCSS.p}>Категория: {product.category}</p>
                                            <p className={AllProductCSS.p}>Цена: {product.price}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className={AllProductCSS.div}>
                            <select value={size} onChange={handleSizeChange}>
                                <option value={1}>1</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            {page > 1 && (
                                <button onClick={() => handlePageChange(page - 1)} className={AllProductCSS.button}>⏴</button>
                            )}
                            {page <= totalPages - 1 && (
                                <button onClick={() => handlePageChange(page + 1)} className={AllProductCSS.button}>⏵</button>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Загрузка...</p>
                )}
            </article>
        </div>
    );
};

export default FavoritesProducts;
