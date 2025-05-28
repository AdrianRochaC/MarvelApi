import { Link } from 'react-router-dom';
import './style.css';

function Menu() {
    return (
        <nav className="c-menu">
          <Link to="/">Home</Link>
          <Link to="/capturados">Agregados</Link>
          <Link to="/aleatorios">Seleccionar</Link>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/favoritos">Favoritos</Link>
        </nav>
    )
  }
  
  export default Menu