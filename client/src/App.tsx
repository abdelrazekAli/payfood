import "./utils/axiosInterceptor";
import { useEffect } from "react";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { getUser } from "./redux/user.slice";
import { checkUser } from "./utils/checkUser";
import { useAppSelector } from "../src/redux/store.hooks";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import pages
import { QR } from "./pages/admin/QR";
import { OrderDetails } from "./pages/user/OrderDetails";
import { Login } from "./pages/admin/Login";
import { Signup } from "./pages/admin/Signup";
import { Orders } from "./pages/admin/Orders";
import { Coupons } from "./pages/admin/Coupons";
import { Profile } from "./pages/admin/Profile";
import { MainMenu } from "./pages/user/MainMenu";
import { Checkout } from "./pages/user/Checkout";
import { EditMenu } from "./pages/admin/EditMenu";
import { EditBank } from "./pages/admin/EditBank";
import { Dashboard } from "./pages/admin/Dashboard";
import { ResetPass } from "./pages/admin/ResetPass";
import { ItemDetails } from "./pages/user/ItemDetails";
import { OrderSuccess } from "./pages/user/OrderSuccess";
import { SendResetPass } from "./pages/admin/SendResetPass";

function AppWraper() {
  const App = () => {
    const user = useAppSelector(getUser);
    useEffect(() => {
      //check that user account is still activated or not
      user && checkUser(user._id);
    }, [user]);

    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/reset-pass/:userId/:token"
            element={<ResetPass />}
          />
          <Route path="/admin/send-reset-pass" element={<SendResetPass />} />
          <Route path="/menu/:restId/:tableId" element={<MainMenu />} />
          <Route
            path="/menu/:restId/:tableId/item/:itemId"
            element={<ItemDetails />}
          />
          <Route
            path="/menu/:restId/:tableId/order"
            element={<OrderDetails />}
          />
          <Route
            path="/menu/:restId/:tableId/checkout"
            element={<Checkout />}
          />
          <Route
            path="/menu/:restId/:tableId/order/success"
            element={<OrderSuccess />}
          />
          {user ? (
            <>
              <Route path="/admin/tables" element={<QR />} />
              <Route path="/admin/bank" element={<EditBank />} />
              <Route path="/admin/menu" element={<EditMenu />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/coupons" element={<Coupons />} />
              <Route path="/admin/profile" element={<Profile />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route
                path="*"
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </>
          ) : (
            <>
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/signup" element={<Signup />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  };

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWraper;
