import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import App from "../App";
import Home from "../pages/Home";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route path="" element={<Signup/>} />
            <Route path="login" element={<Login/>} />
            <Route path="welcome" element={<Home/>} />
        </Route>
    )
)

export default router