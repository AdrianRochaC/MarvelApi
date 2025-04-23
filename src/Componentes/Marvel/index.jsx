// Marvel/index.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCharacterById } from '../../utils/marvelAPI'; // Usamos la función que trae un solo personaje

function Marvel() {
  const { id } = useParams(); // Obtener el ID del personaje desde la URL
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    const obtenerPersonaje = async () => {
      const data = await fetchCharacterById(id);
      setCharacter(data);
    };

    obtenerPersonaje();
  }, [id]);

  if (!character) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{character.name}</h2>
      <img
        src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
        alt={character.name}
        width="300"
      />
      <p>ID: {character.id}</p>
      <p>{character.description}</p>
      <button>❤️ Favorito</button>
    </div>
  );
}

export default Marvel;
