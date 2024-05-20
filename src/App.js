import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import UserPage from './components/User';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import Products from "./components/Products";
import Product from "./components/Product";
import CartPage from "./components/Cart";
import CreateProductPage from "./components/CreateProduct";
import UserOrder from "./components/UserOrder";
import AllOrder from "./components/AllOrder";
import FavoritesProducts from "./components/Favorites";

const ROLES = {
  "USER": 2001,
  "ADMIN": 5150
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Home />} />
        <Route path="product" element={<Products />} />
        <Route path="favorites" element={<FavoritesProducts />} />
        <Route path="product/:id" element={<Product />} />


        <Route element={<RequireAuth allowedRoles={[ROLES.USER]} />}>
          <Route path="cart" element={<CartPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.USER]} />}>
          <Route path="order" element={<UserOrder />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/order" element={<AllOrder />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.USER]} />}>
          <Route path="user" element={<UserPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/product/create" element={<CreateProductPage />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;