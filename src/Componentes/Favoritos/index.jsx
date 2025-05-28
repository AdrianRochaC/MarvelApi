import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Carga favoritos de localStorage al montar el componente
    const favoritosStorage = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setFavoritos(favoritosStorage);
  }, []);

  const quitarFavorito = (id) => {
    const nuevosFavoritos = favoritos.filter((fav) => fav.id !== id);
    localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
    setFavoritos(nuevosFavoritos);
  };

  if (favoritos.length === 0) {
    return <div className="c-no-favorites">No tienes personajes favoritos aún.</div>;
  }

  return (
    <div className="c-favorites-list">
      <h2>Personajes Favoritos</h2>
      <ul className="c-favorites-grid">
        {favoritos.map((personaje) => (
          <li key={personaje.id} className="c-favorite-item">
            <img
              src={`${personaje.thumbnail.path}.${personaje.thumbnail.extension}`}
              alt={personaje.name}
              className="c-favorite-thumb"
              onClick={() => navigate(`/marvel/${personaje.id}`)}
              style={{ cursor: 'pointer' }}
            />
            <div className="c-favorite-info">
              <h3
                onClick={() => navigate(`/marvel/${personaje.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {personaje.name}
              </h3>
              <button
                className="c-remove-favorite"
                onClick={() => quitarFavorito(personaje.id)}
                aria-label={`Eliminar ${personaje.name} de favoritos`}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favoritos;
