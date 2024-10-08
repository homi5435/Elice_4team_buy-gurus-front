import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Order from "./pages/Order/Order";
import OrderDetail from "./pages/Order/OrderDetail";
import AccordionTest from "./pages/AccordionTest";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} exact/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/order" element={<Outlet />} >
        <Route index element={<Order/>}/>
        <Route path=":orderId" element={<OrderDetail />} />
        <Route path="/test" element={<AccordionTest />}/>
        <Route path="/userMe" element={<MyPage />} />
      </Routes>
    </>
  );


export default App;
