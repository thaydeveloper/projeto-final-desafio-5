import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Charges from "./pages/Charges";
import Clients from "./pages/Clients";
import CustomerDetails from "./pages/CustomerDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import RegistrationConfirmed from "./pages/RegistrationConfirmed";
import RegistrationPassword from "./pages/RegistrationPassword";
import { getItem } from "./services/storage";

function ProtectedRoutes({ redirectTo }) {
  let isAuthenticated = getItem("token");
  if (!isAuthenticated) {
    window.localStorage.clear();
  }
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MainRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoutes redirectTo={"/login"} />}>
        <Route path="/charges" element={<Charges />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/customerDetails/:id" element={<CustomerDetails />} />
        <Route path="/home" element={<Home />} />
      </Route>

      <Route path="/register" element={<Registration />} />
      <Route path="/password" element={<RegistrationPassword />} />
      <Route path="/confirmedRegister" element={<RegistrationConfirmed />} />
    </Routes>
  );
}
export default MainRoutes;
