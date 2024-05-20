import { useNavigate } from "react-router-dom"
import Navigation from "./Navigation";

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div>
            <Navigation/>
            <section>
                <h1>Доступ запрещен</h1>
                <br />
                <p>Вы не можете просматривать данную страницу.</p>
                <div className="flexGrow">
                    <button onClick={goBack}>Назад</button>
                </div>
            </section>
        </div>
    )
}

export default Unauthorized
