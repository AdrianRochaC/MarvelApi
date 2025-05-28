import { useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Registro() {
    const [formulario, setFormulario] = useState({
        nombre: '',
        correo: '',
        password: '',
        fechaNacimiento: '',
        telefono: '',
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        setError(null);

        // 1. Crear usuario en Auth
        const { data, error: errorAuth } = await supabase.auth.signUp({
            email: formulario.correo,
            password: formulario.password,
        });

        if (errorAuth) {
            setError(errorAuth.message);
            return;
        }

        const uid = data.user.id;

        // 2. Insertar en tabla "usuario"
        const { error: errorInsert } = await supabase.from("usuario").insert([
            {
                id: uid,
                nombre: formulario.nombre,
                correo: formulario.correo,
                fecha_nacimiento: formulario.fechaNacimiento,
                telefono: formulario.telefono,
                roll: "usuario",
            },
        ]);

        if (errorInsert) {
            setError("Usuario creado pero error en tabla usuarios: " + errorInsert.message);
        } else {
            navigate("/login");
        }
    };

    return (
        <section className="r-register-container">
            <h2 className="r-register-title">Registro</h2>
            <form className="r-register-form" onSubmit={handleRegistro}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="correo"
                    placeholder="Correo"
                    value={formulario.correo}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formulario.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="fechaNacimiento"
                    value={formulario.fechaNacimiento}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formulario.telefono}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="r-register-button">Registrarse</button>
            </form>
            {error && <p style={{ color: "red", textAlign: "center", marginTop: "15px" }}>{error}</p>}
            <p className="r-register-text">Ya tengo cuenta y quiero loguearme</p>
            <button className="r-register-nav-button" onClick={() => navigate(`/login`)}>Login</button>
        </section>
    );
}

export default Registro;
