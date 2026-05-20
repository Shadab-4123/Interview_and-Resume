import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register, getMe } from "../services/auth.api";


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    // return context;
    const {user, setUser, loading, setLoading} = context;

    const handleLogin = async ({email,password}) => {
        setLoading(true);
        try{
            const data = await login({email, password})
            setUser(data.user);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({username, email, password}) => {
        setLoading(true);
        try {
            const data = await register({username, email, password})
            setUser(data.user);
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try{
        await logout();
        setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
        setLoading(false);
        }
    }

    const fetchMe = async () => {

        setLoading(true);
        try {
        const data = await getMe();
        setUser(data.user);
        } catch (error) {
            console.error('Fetch me error:', error);
        } finally {
        setLoading(false);
    }
    }

    return {
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        fetchMe
    }
}

