// componentes/Capturados/index.jsx
import { useContext } from 'react';
import { MarvelContext } from '../../contexto/contexto';
import { useNavigate } from "react-router-dom";

function Capturados() {
  const { capturados, characters } = useContext(MarvelContext);
  const navigate = useNavigate();

  if (capturados.length === 0) return <p>No tienes personajes capturados aún.</p>;

  // Filtra personajes completos según IDs capturados
  const personajesCapturadosCompletos = characters.filter(char => capturados.includes(char.id));

  return (
    <div className='c-lista'>
      {personajesCapturadosCompletos.map((personaje) => (
        <div
          key={personaje.id}
          className='c-lista-personaje'
          onClick={() => navigate(`/marvel/${personaje.id}`)}
          style={{ cursor: 'pointer', margin: '5px', padding: '5px', border: '2px solid green', borderRadius: '8px' }}
          title="Ver detalle del personaje"
        >
          <img
            src={`${personaje.thumbnail.path}.${personaje.thumbnail.extension}`}
            alt={personaje.name}
            width='auto'
            height='60'
            loading='lazy'
          />
          <p>{personaje.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Capturados;
