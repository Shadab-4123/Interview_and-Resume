import { useAuth } from "../hooks/useAuth";
import React from "react";
// import { useNavigate } from "react-router";

import { Navigate } from "react-router";

const Protected = ({children}) => {

    const { user, loading } = useAuth();
    // const navigate = useNavigate();

    if (loading) {
        return <main><h1>Loading.....</h1></main>
    }

    if (!user) {
        // return <main><h1>Unauthorized. Please login to access this page.</h1></main>
        // navigate('/login')
        return <Navigate to="/login" replace={true} />
        // return null; // Return null to prevent rendering the protected content
    }

    return children;
}

export default Protected