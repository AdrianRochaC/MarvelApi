import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import './style.css'
import Filtro from '../Filtro';
import { fetchAllCharacters } from '../../utils/marvelAPI';

function Listas() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('All');
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Cargando personajes...");
  const navigate = useNavigate();

  // Lista ampliada de nombres de héroes y villanos para aumentar la coincidencia
  const heroesKeywords = ["iron", "captain", "spider", "thor", "hulk", "america", "man", "widow", "panther", "marvel", "hawk", "vision", "strange", "fury", "wolverine", "cyclops", "xavier", "beast", "angel"];
  
  // Lista ampliada de villanos
  const villainsKeywords = ["thanos", "loki", "ultron", "goblin", "doom", "venom", "magneto", "skull", "octopus", "kingpin", "mystique", "apocalypse", "sinister", "sentinel", "carnage", "juggernaut", "leader", "abomination", "lizard", "mandarin", "modok", "hela", "kree", "dormammu", "evil"];

  // Función para determinar el tipo de un personaje de manera más precisa
  const determinarTipo = (character) => {
    const nameLower = character.name.toLowerCase();
    const description = character.description?.toLowerCase() || "";
    
    // Comprobar si la descripción o el nombre contienen referencias a ser un villano
    if (description.includes("villain") || description.includes("enemy") || 
        description.includes("antagonist") || description.includes("foe") ||
        villainsKeywords.some(keyword => nameLower.includes(keyword))) {
      return "Villains";
    }
    
    // Verificar si el nombre contiene alguna palabra clave de héroes
    if (heroesKeywords.some(keyword => nameLower.includes(keyword))) {
      return "Heroes";
    }
    
    // Como fallback, hacer una clasificación por letras del alfabeto
    // Personajes que comienzan con A-M son héroes, N-Z son villanos
    const firstLetter = nameLower.charAt(0);
    if (firstLetter >= 'a' && firstLetter <= 'm') {
      return "Heroes";
    } else if (firstLetter >= 'n' && firstLetter <= 'z') {
      return "Villains";
    }
    
    // El resto serán categorizados como "Other"
    return "Other";
  };

  // Cargar todos los personajes una sola vez
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setIsLoading(true);
        
        // Crear una función que se ejecutará cada vez que haya progreso
        const updateProgress = (loaded, total) => {
          setLoadingMessage(`Cargando personajes... (${loaded}/${total || '?'})`);
        };
        
        // Llamada modificada para obtener todos los personajes
        const personajes = await fetchAllCharacters();
        
        // Asignar tipos a los personajes
        let heroesCount = 0;
        let villainsCount = 0;
        
        const personajesConTipo = personajes.map(character => {
          const tipo = determinarTipo(character);
          
          // Contabilizar por tipo
          if (tipo === "Heroes") heroesCount++;
          if (tipo === "Villains") villainsCount++;
          
          return { ...character, tipo };
        });
        
        console.log(`Total de personajes: ${personajesConTipo.length}`);
        console.log(`Héroes encontrados: ${heroesCount}`);
        console.log(`Villanos encontrados: ${villainsCount}`);
        
        setAllCharacters(personajesConTipo);
        setFilteredCharacters(personajesConTipo); // Inicialmente mostrar todos
      } catch (error) {
        console.error("Error al cargar personajes:", error);
        setLoadingMessage("Error al cargar los personajes. Intenta recargar la página.");
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  // Aplicar filtro cuando cambia el tipo seleccionado o la búsqueda
  useEffect(() => {
    if (allCharacters.length === 0) return;
    
    let resultado = [...allCharacters];
    
    // Filtrar por tipo
    if (tipoSeleccionado !== 'All') {
      resultado = resultado.filter(character => character.tipo === tipoSeleccionado);
    }
    
    // Filtrar por búsqueda
    if (busqueda.length >= 3) {
      resultado = resultado.filter(character =>
        character.name.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    
    setFilteredCharacters(resultado);
  }, [tipoSeleccionado, busqueda, allCharacters]);

  const handleTipoChange = (tipo) => {
    setTipoSeleccionado(tipo);
  };

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
      
      {tipoSeleccionado !== 'All' && (
        <div className="c-filter-info">
          Mostrando: {tipoSeleccionado} 
          ({filteredCharacters.length} personajes)
        </div>
      )}

      <section className='c-lista'>
        {isLoading ? (
          <div className="c-loading-container">
            <p>{loadingMessage}</p>
            <div className="c-loading-spinner"></div>
          </div>
        ) : filteredCharacters.length > 0 ? (
          filteredCharacters.map((character, index) => (
            <div 
              className='c-lista-character'
              onClick={() => navigate(`/marvel/${character.id}`)}
              key={character.id || index}
            >
              <p>{character.name}</p>
              <img 
                src={`${character.thumbnail.path}.${character.thumbnail.extension}`} 
                alt={character.name} 
                width='auto' 
                height='60' 
                loading='lazy' 
              />
              <p>{character.name}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron personajes que coincidan con los criterios.</p>
        )}
      </section>
    </>
  );
}

export default Listas;