import { Link } from "react-router-dom"
import Navigation from "./Navigation";

const Missing = () => {
    return (
        <div>
            <Navigation/>
            <article style={{ padding: "100px" }}>
                <h1>Упс!</h1>
                <p>Страница не найдена</p>
                <div className="flexGrow">
                    <Link to="/">Домой</Link>
                </div>
            </article>
        </div>
    )
}

export default Missing
