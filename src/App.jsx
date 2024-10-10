import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Order from "./pages/Order/Order";
import OrderDetail from "./pages/OrderDetail/OrderDetail";
import AccordionTest from "./pages/AccordionTest";
import MyPage from "./pages/MyPage";
import OrderItem from "./pages/OrderItem/OrderItem";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/order" element={<Order/>} />
        <Route path="/order/:orderId" element={<OrderDetail />} />
        
        <Route path="/userMe" element={<MyPage />} />
        <Route path="/orderitem" element={<OrderItem />} />

        <Route path="/test" element={<AccordionTest />}/>
      </Routes>
    </>
  );
}

export default App;
