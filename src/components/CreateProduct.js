import React, { useState } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CreateProductCSS from "../styles/CreateProduct.module.css"
import Navigation from "./Navigation";

const CreateProductPage = () => {
    const [productData, setProductData] = useState({
        title: "",
        description: "",
        count: 0,
        category: "",
        price: 0
    });
    const [imageFile, setImageFile] = useState(null); // Состояние для хранения выбранного файла

    const axiosPrivate = useAxiosPrivate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]); // Записываем выбранный файл в состояние
    };

    const handleCreateProduct = async () => {
        try {
            const response = await axiosPrivate.post('/admin/product', productData);
            const productId = response.data.id; // Получаем ID созданного продукта
            if (imageFile) {
                const formData = new FormData();
                formData.append('multipartFile', imageFile); // Добавляем файл в FormData
                await axiosPrivate.post(`/product/image/upload/${productId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data' // Устанавливаем правильный заголовок для FormData
                    }
                });
            }
            // Очищаем поля после успешного создания продукта
            setProductData({
                title: "",
                description: "",
                count: 0,
                category: "",
                price: 0
            });
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    return (
        <div>
            <Navigation/>
            <div className={CreateProductCSS.container}>
                <h1>Создать продукт</h1>
                <label className={CreateProductCSS.label}>
                    Наименование:
                    <input
                        type="text"
                        name="title"
                        value={productData.title}
                        onChange={handleInputChange}
                        className={CreateProductCSS.input}
                    />
                </label>
                <label className={CreateProductCSS.label}>
                    Описание:
                    <input
                        type="text"
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                        className={CreateProductCSS.input}
                    />
                </label>
                <label className={CreateProductCSS.label}>
                    Количество:
                    <input
                        type="number"
                        name="count"
                        value={productData.count}
                        onChange={handleInputChange}
                        className={CreateProductCSS.input}
                    />
                </label>
                <label className={CreateProductCSS.label}>
                    Категория:
                    <input
                        type="text"
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                        className={CreateProductCSS.input}
                    />
                </label>
                <label className={CreateProductCSS.label}>
                    Цена:
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        className={CreateProductCSS.input}
                    />
                </label>
                <label className={CreateProductCSS.label}>
                    Изображение:
                    <input
                        type="file"
                        accept="image/jpeg" // Указываем, что принимаем только jpg-файлы
                        onChange={handleImageChange}
                        className={CreateProductCSS.input}
                    />
                </label>
                <button onClick={handleCreateProduct} className={CreateProductCSS.button}>Create Product</button>
            </div>
        </div>
    );
};

export default CreateProductPage;
