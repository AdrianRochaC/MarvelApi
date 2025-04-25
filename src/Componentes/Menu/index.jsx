import { Link } from 'react-router-dom';
import './style.css';

function Menu() {
    return (
        <nav className="c-menu">
          <Link to="/">Home</Link>
          <Link to="/capturados">Heroes</Link>
          <Link to="/aleatorios">Villanos</Link>
          <Link to="/comics">Comics</Link>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/favoritos">Favoritos</Link>
        </nav>
    )
  }
  
  export default Menu