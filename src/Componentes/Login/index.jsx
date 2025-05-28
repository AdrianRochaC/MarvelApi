import { useState } from 'react'
import { supabase } from '../../supabase'
import './style.css'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) alert("usuario o contraseña no valido")
        else {
            navigate("/")
        }
    }

    return (
        <section className="r-register-container">
            <h2 className="r-register-title">Login</h2>
            <form className="r-register-form" onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="r-register-button">Iniciar sesión</button>
            </form>

            <p className="r-register-text">No tiene cuenta?</p>
            <button className="r-register-nav-button" onClick={() => navigate(`/registro`)}>Regístrese</button>
        </section>
    )
}

export default Login
