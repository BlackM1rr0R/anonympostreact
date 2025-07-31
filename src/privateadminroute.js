import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
    const user=JSON.parse(localStorage.getItem("user"));
    if(user?.role==="ADMIN"){
        return children;
    }
    else{
        return <Navigate to="/" replace />;
    }
}

export default PrivateAdminRoute;