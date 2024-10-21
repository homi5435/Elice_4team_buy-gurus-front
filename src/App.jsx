import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Product from "./pages/Product/Product";
import ProductDetail from "./pages/Product/ProductDetail";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Order from "./pages/Order/Order";
import OrderDetail from "./pages/OrderDetail/OrderDetail";
import AccordionTest from "./pages/AccordionTest";
import MyPage from "./pages/user/MyPage";
import OrderItem from "./pages/OrderItem/OrderItem";
import ResetPassword from "./pages/user/ResetPassword";
import SellerRegistration from "./pages/user/SellerRegistration";
import CategoryManagement from "./pages/Category/Category";
import Payment from "./pages/OrderItem/Payment";
import ProductCreate from "./pages/Product/ProductCreate";

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/home" element={<Product />} exact />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/seller-registration" element={<SellerRegistration />} />

        <Route path="/order" element={<Order />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />

        <Route path="/userMe" element={<MyPage />} />
        <Route path="/orderitem" element={<OrderItem />} />
        <Route path="/payment" element={<Payment />} />

        <Route path="/categoryManagement" element={<CategoryManagement />} />

        <Route path="/test" element={<AccordionTest />} />
        <Route path="/product-create" element={<ProductCreate />} />
      </Routes>
    </>
  );
}

export default App;
