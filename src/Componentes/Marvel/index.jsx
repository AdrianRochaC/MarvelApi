import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCharacterById } from '../../utils/marvelAPI';
import './style.css'; // Asegúrate de crear este archivo CSS para los estilos

function Marvel() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPersonaje = async () => {
      try {
        setLoading(true);
        const data = await fetchCharacterById(id);
        setCharacter(data);
        console.log("Datos completos del personaje:", data); // Para depuración
      } catch (err) {
        setError("Error al cargar el personaje. Por favor, inténtalo de nuevo.");
        console.error("Error al obtener datos del personaje:", err);
      } finally {
        setLoading(false);
      }
    };

    obtenerPersonaje();
  }, [id]);

  if (loading) return <div className="c-loading">Cargando información del personaje...</div>;
  if (error) return <div className="c-error">{error}</div>;
  if (!character) return <div className="c-not-found">Personaje no encontrado</div>;

  const { name, description, thumbnail, comics, series, stories, events, urls } = character;

  return (
    <div className="c-character-detail">
      <button className="c-back-button" onClick={() => navigate(-1)}>
        &larr; Volver a la lista
      </button>
      
      <div className="c-character-header">
        <img 
          src={`${thumbnail.path}.${thumbnail.extension}`}
          alt={name}
          className="c-character-image"
        />
        <div className="c-character-title">
          <h1>{name}</h1>
          <button className="c-favorite-button">❤️ Favorito</button>
        </div>
      </div>

      <div className="c-character-section">
        <h2>Información General</h2>
        <div className="c-character-info">
          <p><strong>ID:</strong> {character.id}</p>
          <p><strong>Descripción:</strong> {description || "No hay descripción disponible."}</p>
        </div>
      </div>

      {comics && comics.items && comics.items.length > 0 && (
        <div className="c-character-section">
          <h2>Cómics ({comics.available})</h2>
          <ul className="c-list">
            {comics.items.slice(0, 10).map((comic, index) => (
              <li key={index}>{comic.name}</li>
            ))}
            {comics.available > 10 && <li>...y {comics.available - 10} más</li>}
          </ul>
        </div>
      )}

      {series && series.items && series.items.length > 0 && (
        <div className="c-character-section">
          <h2>Series ({series.available})</h2>
          <ul className="c-list">
            {series.items.slice(0, 10).map((serie, index) => (
              <li key={index}>{serie.name}</li>
            ))}
            {series.available > 10 && <li>...y {series.available - 10} más</li>}
          </ul>
        </div>
      )}

      {stories && stories.items && stories.items.length > 0 && (
        <div className="c-character-section">
          <h2>Historias ({stories.available})</h2>
          <ul className="c-list">
            {stories.items.slice(0, 10).map((story, index) => (
              <li key={index}>
                {story.name} <span className="c-story-type">({story.type})</span>
              </li>
            ))}
            {stories.available > 10 && <li>...y {stories.available - 10} más</li>}
          </ul>
        </div>
      )}

      {events && events.items && events.items.length > 0 && (
        <div className="c-character-section">
          <h2>Eventos ({events.available})</h2>
          <ul className="c-list">
            {events.items.slice(0, 10).map((event, index) => (
              <li key={index}>{event.name}</li>
            ))}
            {events.available > 10 && <li>...y {events.available - 10} más</li>}
          </ul>
        </div>
      )}

      {urls && urls.length > 0 && (
        <div className="c-character-section">
          <h2>Enlaces</h2>
          <div className="c-links">
            {urls.map((url, index) => (
              <a 
                key={index} 
                href={url.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="c-link-button"
              >
                {url.type === "detail" ? "Página de Marvel" : 
                 url.type === "wiki" ? "Wiki" : 
                 url.type === "comiclink" ? "Cómics" : url.type}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="c-character-footer">
        <p className="c-copyright">
          Datos proporcionados por la API de Marvel. © {new Date().getFullYear()} MARVEL
        </p>
      </div>
    </div>
  );
}

export default Marvel;