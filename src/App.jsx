import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import './assets/css/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import Login from './auth/Login';
import ForgotPassword from "./auth/ForgotPassword";
import Otp from "./auth/Otp";
import ResetPassword from "./auth/ResetPassword";
import Dashboard from "./screens/Dashboard";
import Layout from "./Layout";
import Users from "./screens/Users";
import AddUser from "./screens/Users/addUser";
import EditUser from "./screens/Users/editUser";
import ViewUser from "./screens/Users/viewUser";
import Banners from "./screens/Banners";
import AddBanner from "./screens/Banners/AddBanner";
import EditBanner from "./screens/Banners/EditBanner";
import Categories from "./screens/Categories";
import AddCategory from "./screens/Categories/AddCategory";
import EditCategory from "./screens/Categories/EditCategory";
import Contacts from "./screens/Contacts";
import ViewContact from "./screens/Contacts/viewContact";
import Coupons from "./screens/Coupons";
import ViewCoupon from "./screens/Coupons/viewCoupon";
import Host from "./screens/Host";
import AddHost from "./screens/Host/addHost";
import EditHost from "./screens/Host/editHost";
import ViewHost from "./screens/Host/viewHost";
import Bookings from "./screens/Bookings";
import ViewBooking from "./screens/Bookings/viewBooking";
import Property from "./screens/Property";
import AddProperty from "./screens/Property/addProperty";
import EditProperty from "./screens/Property/editProperty";
import ViewProperty from "./screens/Property/viewProperty";
import Invoices from "./screens/Invoices";
import ViewInvoice from "./screens/Invoices/viewInvoice";
import Reports from "./screens/Reports";
import Notifications from "./screens/Notifications";
import ProfileSetting from "./screens/ProfileSetting";
import ProtectedRoute from "./guards/ProtectedRoute";

function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      {loading ? (
        <div className="loaderdiv">
          <Spinner color="#402668" size={40} speed={1} animating={true} />
        </div>
      ) : (
          <Routes >
            <Route path="/" element={<Login/>}/>
            <Route path="/forgotpassword" element={<ForgotPassword/>}/>
            <Route path="/otp" element={<Otp/>}/>
            <Route path="/resetpassword" element={<ResetPassword/>}/>
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>}/>
            <Route path="/users" element={<ProtectedRoute><Layout><Users/></Layout></ProtectedRoute>}/>
            <Route path="/users/adduser" element={<ProtectedRoute><Layout><AddUser/></Layout></ProtectedRoute>}/>
            <Route path="/users/edituser" element={<ProtectedRoute><Layout><EditUser/></Layout></ProtectedRoute>}/>
            <Route path="/users/viewuser" element={<ProtectedRoute><Layout><ViewUser/></Layout></ProtectedRoute>}/>
            <Route path="/banners" element={<ProtectedRoute><Layout><Banners/></Layout></ProtectedRoute>}/>
            <Route path="/banners/add" element={<ProtectedRoute><Layout><AddBanner/></Layout></ProtectedRoute>}/>
            <Route path="/banners/edit/:id" element={<ProtectedRoute><Layout><EditBanner/></Layout></ProtectedRoute>}/>
            <Route path="/categories" element={<ProtectedRoute><Layout><Categories/></Layout></ProtectedRoute>}/>
            <Route path="/categories/add" element={<ProtectedRoute><Layout><AddCategory/></Layout></ProtectedRoute>}/>
            <Route path="/categories/edit/:id" element={<ProtectedRoute><Layout><EditCategory/></Layout></ProtectedRoute>}/>
            <Route path="/contacts" element={<ProtectedRoute><Layout><Contacts/></Layout></ProtectedRoute>}/>
            <Route path="/contacts/view/:id" element={<ProtectedRoute><Layout><ViewContact/></Layout></ProtectedRoute>}/>
            <Route path="/coupons" element={<ProtectedRoute><Layout><Coupons/></Layout></ProtectedRoute>}/>
            <Route path="/coupons/view/:id" element={<ProtectedRoute><Layout><ViewCoupon/></Layout></ProtectedRoute>}/>
            <Route path="/host" element={<ProtectedRoute><Layout><Host/></Layout></ProtectedRoute>}/>
            <Route path="/host/addhost" element={<ProtectedRoute><Layout><AddHost/></Layout></ProtectedRoute>}/>
            <Route path="/host/edithost" element={<ProtectedRoute><Layout><EditHost/></Layout></ProtectedRoute>}/>
            <Route path="/host/viewhost" element={<ProtectedRoute><Layout><ViewHost/></Layout></ProtectedRoute>}/>
            <Route path="/bookings" element={<ProtectedRoute><Layout><Bookings/></Layout></ProtectedRoute>}/>
            <Route path="/bookings/viewbooking" element={<ProtectedRoute><Layout><ViewBooking/></Layout></ProtectedRoute>}/>
            <Route path="/property" element={<ProtectedRoute><Layout><Property/></Layout></ProtectedRoute>}/>
            <Route path="/property/addproperty" element={<ProtectedRoute><Layout><AddProperty/></Layout></ProtectedRoute>}/>
            <Route path="/property/editproperty" element={<ProtectedRoute><Layout><EditProperty/></Layout></ProtectedRoute>}/>
            <Route path="/property/viewproperty" element={<ProtectedRoute><Layout><ViewProperty/></Layout></ProtectedRoute>}/>
            <Route path="/invoices" element={<ProtectedRoute><Layout><Invoices/></Layout></ProtectedRoute>}/>
            <Route path="/invoices/viewinvoice" element={<ProtectedRoute><Layout><ViewInvoice/></Layout></ProtectedRoute>}/>
            <Route path="/reports" element={<ProtectedRoute><Layout><Reports/></Layout></ProtectedRoute>}/>
            <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications/></Layout></ProtectedRoute>}/>
            <Route path="/profilesetting" element={<ProtectedRoute><Layout><ProfileSetting/></Layout></ProtectedRoute>}/>
          </Routes>
      )}
    </>
  );
}

export default App;
