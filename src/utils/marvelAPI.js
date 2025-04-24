import md5 from 'md5';

// Marvel API keys
const PUBLIC_KEY = 'ca42b51068cea80cd6968e18ea34bbad';
const PRIVATE_KEY = '13a4817820d57088649a8e8801bf1405c06674a0';

// Create auth parameters for Marvel API
export const getAuthParams = () => {
  const ts = new Date().getTime();
  const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
  return `ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
};

// Base URL for Marvel API
export const MARVEL_API_BASE = 'https://gateway.marvel.com/v1/public';

// Fetch all characters with paginación
export const fetchAllCharacters = async (limit = 100) => {
  try {
    let allCharacters = [];
    let offset = 0;
    let total = 1; // Inicializamos en 1 para que entre al bucle al menos una vez
    
    // Hacemos solicitudes hasta obtener todos los personajes
    while (offset < total) {
      console.log(`Obteniendo personajes: offset ${offset}, de un total de ${total}`);
      
      const url = `${MARVEL_API_BASE}/characters?limit=${limit}&offset=${offset}&${getAuthParams()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Actualizamos el total solo la primera vez
      if (offset === 0) {
        total = data.data.total;
      }
      
      // Añadimos los personajes obtenidos
      allCharacters = [...allCharacters, ...data.data.results];
      
      // Incrementamos el offset para la siguiente página
      offset += limit;
      
      // Limitamos a máximo 500 personajes para no sobrecargar la aplicación
      if (allCharacters.length >= 500) {
        console.log("Alcanzado el límite máximo de 500 personajes");
        break;
      }
    }
    
    console.log(`Total de personajes cargados: ${allCharacters.length}`);
    return allCharacters;
    
  } catch (error) {
    console.error("Error al obtener personajes:", error);
    return []; // Devolvemos un array vacío en caso de error
  }
};

// Fetch character by ID
export const fetchCharacterById = async (id) => {
  try {
    const url = `${MARVEL_API_BASE}/characters/${id}?${getAuthParams()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data.results[0];
  } catch (error) {
    console.error(`Error al obtener el personaje con ID ${id}:`, error);
    throw error;
  }
};