import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Product from "./pages/Product/Product";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Order from "./pages/Order/Order";
import OrderDetail from "./pages/OrderDetail/OrderDetail";
import AccordionTest from "./pages/AccordionTest";
import MyPage from "./pages/user/MyPage";
import OrderItem from "./pages/OrderItem/OrderItem";
import ResetPassword from "./pages/user/ResetPassword";
import SellerRegistration from "./pages/user/SellerRegistration";
import Payment from "./pages/Payment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Product />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/seller-registration" element={<SellerRegistration />} />

        <Route path="/order" element={<Order />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />

        <Route path="/userMe" element={<MyPage />} />
        <Route path="/orderitem" element={<OrderItem />} />
        <Route path="/payment" element={<Payment />} />

        <Route path="/test" element={<AccordionTest />} />
      </Routes>
    </>
  );
}

export default App;
