import React from 'react'
import '../auth.form.scss'
import { useNavigate,Link } from 'react-router'

import { useAuth } from '../hooks/useAuth'


function Register() {

    const navigate = useNavigate()
    const { loading, register } = useAuth();
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()
        const registrationData = {
            username,
            email,
            password
        }

        try {
            await register(registrationData)
            navigate('/login')
        } catch (error) {
            console.error('Registration failed:', error)
        }

        if (loading) {
            return (<main><h1>Loading.....</h1></main>)
        }
    }
    

    return (
        <main>
        <div className="form-container">
            <h1>Register</h1>
            {/* Add your login form here */}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="password">Username:</label>
                    <input
                    value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     type="text" id="username" name="username" placeholder="Enter your username" required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    type="email" id="email" name="email" placeholder="Enter your email" required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    type="password" id="password" name="password" placeholder="Enter your password" required />
                </div>
                <button type="submit" className="button primary-button">Register</button>
            </form>
            <p>Already have an account? <Link to={"/login"}>Login</Link></p>
        </div>
    </main>
    )
}

export default Register;