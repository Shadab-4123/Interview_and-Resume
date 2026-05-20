import {createBrowserRouter} from 'react-router'
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'
// import Home from './pages/Home'
import Protected from './features/auth/components/Protected.jsx'


export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Protected><h1>Home Page</h1></Protected>
    },
    {
        path:"*",
        element:<h1>404 Not Found</h1>
    }

])
