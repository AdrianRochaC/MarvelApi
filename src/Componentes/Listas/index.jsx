// Listas/index.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import './style.css'
import Filtro from '../Filtro';
import { fetchAllCharacters } from '../../utils/marvelAPI';

function Listas() {
  const [data, setData] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('All');
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  // Definir los héroes y villanos de forma manual (esto podría mejorar si la API tuviera una propiedad para esto)
  const heroes = ["Iron Man", "Captain America", "Spider-Man", "Thor", "Hulk"];
  const villains = ["Thanos", "Loki", "Ultron", "Green Goblin", "Doctor Doom"];

  useEffect(() => {
    const obtenerDatos = async () => {
      const personajes = await fetchAllCharacters(); // Traemos todos los personajes

      // Filtrar por tipo seleccionado
      if (tipoSeleccionado === 'All') {
        setData(personajes);
      } else if (tipoSeleccionado === 'Heroes') {
        setData(personajes.filter(p => heroes.includes(p.name))); // Filtrar héroes
      } else if (tipoSeleccionado === 'Villains') {
        setData(personajes.filter(p => villains.includes(p.name))); // Filtrar villanos
      }
    };

    obtenerDatos();
  }, [tipoSeleccionado]);

  const handleTipoChange = (tipo) => {
    setTipoSeleccionado(tipo);
  };

  let resultados = data;

  if (busqueda.length >= 3) {
    resultados = data.filter(pokemon =>
      pokemon.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  return (
    <>
      <input
        type="text"
        placeholder="Buscar Personaje"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="c-buscador"
      />

      <Filtro onTipoChange={handleTipoChange} />

      <section className='c-lista'>
        {resultados.map((character, index) => (
          <div className='c-lista-character'
            onClick={() => navigate(`/marvel/${character.id}`)} // Navegar al detalle del superhéroe
            key={index}>
            <p>{character.name}</p>
            <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} width='auto' height='60' loading='lazy' />
            <p>{character.name}</p>
          </div>
        ))}
      </section>
    </>
  );
}

export default Listas;
