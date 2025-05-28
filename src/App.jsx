import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MarvelProvider } from './contexto/contexto';
import { supabase } from "./supabase";

import './App.css'
import Aleatorios from './Componentes/Aleatorios'
import Capturados from './Componentes/Capturados'
import Favoritos from './Componentes/Favoritos'
import Marvel from './Componentes/Marvel'; // Componente donde verás el detalle
import Listas from './Componentes/Listas'; // Lista de superhéroes
import Usuario from './Componentes/Usuario'
import Menu from './Componentes/Menu';
import Login from './Componentes/Login';
import Registro from './Componentes/registro';

function App() {

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function verificarSesion() {
      const { data: { session } } = await supabase.auth.getSession();
      setUsuario(session?.user || null);
      setCargando(false);
    }
    verificarSesion();

    // Escucha cambios en la sesión
    supabase.auth.onAuthStateChange((_event, session) => {

      setUsuario(session?.user || null);
    });
  }, []);

  if (cargando) return <p>Cargando...</p>;

  return (
    <>
      <MarvelProvider>
        <Router>

          {usuario && <Menu />}

          <Routes>
            <Route path="/" element={usuario ? <Listas /> : <Navigate to="/login"/>} />
            <Route path="/usuarios" element={usuario ? <Usuario />: <Navigate to="/login"/>} />
            <Route path="/aleatorios" element={usuario ? <Aleatorios />: <Navigate to="/login"/>} />
            <Route path="/capturados" element={usuario ? <Capturados />: <Navigate to="/login"/>} />
            <Route path="/favoritos" element={usuario ? <Favoritos />: <Navigate to="/login"/>} />
            <Route path="/marvel/:id" element={usuario ? <Marvel />: <Navigate to="/login"/>} />

            <Route path="/login" element={<Login/>} />
            <Route path="/registro" element={<Registro/>} />
          </Routes>
        </Router>
      </MarvelProvider>
    </>
  )
}

export default App
