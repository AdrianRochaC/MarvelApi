// componentes/Aleatorios/index.jsx
import { useContext } from 'react';
import { MarvelContext } from '../../contexto/contexto';
import { useNavigate } from "react-router-dom";

function Aleatorios() {
  const { characters, loading, error, capturados, setCapturados } = useContext(MarvelContext);
  const navigate = useNavigate();

  if (loading) return <p>Cargando personajes...</p>;
  if (error) return <p>{error}</p>;

  // Marca o desmarca personaje usando solo id
  const toggleCapturado = (personaje) => {
    if (capturados.includes(personaje.id)) {
      setCapturados(capturados.filter(id => id !== personaje.id));
    } else {
      setCapturados([...capturados, personaje.id]);
    }
  };

  return (
    <div className='c-lista'>
      {characters.map((personaje) => {
        const esCapturado = capturados.includes(personaje.id);
        return (
          <div
            key={personaje.id}
            className='c-lista-personaje'
            style={{
              cursor: 'pointer',
              border: esCapturado ? '2px solid green' : '2px solid transparent',
              padding: '5px',
              margin: '5px',
              borderRadius: '8px',
            }}
            onClick={() => navigate(`/marvel/${personaje.id}`)}
          >
            <img
              src={`${personaje.thumbnail.path}.${personaje.thumbnail.extension}`}
              alt={personaje.name}
              width='auto'
              height='60'
              loading='lazy'
              onClick={(e) => {
                e.stopPropagation();
                toggleCapturado(personaje);
              }}
              style={{ cursor: 'pointer' }}
              title={esCapturado ? "Quitar de capturados" : "Marcar como capturado"}
            />
            <p>{personaje.name}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Aleatorios;
