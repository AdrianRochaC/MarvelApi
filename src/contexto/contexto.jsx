import { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { fetchAllCharacters } from '../utils/marvelAPI';

export const MarvelContext = createContext();

export function MarvelProvider({ children }) {
  const [usuarioid, setUsuarioid] = useState(null);

  const favoritosGuardados = JSON.parse(localStorage.getItem("favoritosMarvel")) || [];
  const [favoritos, setFavoritos] = useState(favoritosGuardados);

  // Inicialmente capturados vacío, luego se llenará con DB o localStorage
  const [capturados, setCapturados] = useState([]);

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener usuario y cargar capturados desde DB
  useEffect(() => {
    async function loadUserAndCapturados() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (user) {
        setUsuarioid(user.id);
        // Cargar capturados desde DB
        const { data, error } = await supabase
          .from('capturados')
          .select('capturados')
          .eq('usuarioid', user.id)
          .single();

        if (error) {
          // No existe registro, fallback a localStorage
          const capturadosLS = JSON.parse(localStorage.getItem("capturadosMarvel")) || [];
          setCapturados(capturadosLS);
        } else {
          // data.capturados es array de IDs o strings
          setCapturados(data?.capturados || []);
          // sincronizar localStorage con DB
          localStorage.setItem("capturadosMarvel", JSON.stringify(data?.capturados || []));
        }
      } else {
        // No usuario, cargar desde localStorage para uso offline
        const capturadosLS = JSON.parse(localStorage.getItem("capturadosMarvel")) || [];
        setCapturados(capturadosLS);
      }
    }
    loadUserAndCapturados();
  }, []);

  // Cargar personajes generales igual que antes
  useEffect(() => {
    const cargarPersonajes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllCharacters(100);
        setCharacters(data);
      } catch (err) {
        setError("Error al cargar personajes");
      } finally {
        setLoading(false);
      }
    };
    cargarPersonajes();
  }, []);

  // Guardar capturados en localStorage y DB cada vez que cambie
 useEffect(() => {
  localStorage.setItem("capturadosMarvel", JSON.stringify(capturados));

  if (!usuarioid) {
    console.log("No hay usuario logueado, no guardamos en DB");
    return; // solo guardar en DB si hay usuario logueado
  }

  async function guardarCapturadosEnDB() {
    console.log("Guardando capturados en DB:", capturados, "para usuario:", usuarioid);
    const { data, error } = await supabase
      .from('capturados')
      .upsert(
        { usuarioid, capturados },
        { onConflict: 'usuarioid' }
      );

    if (error) {
      console.error("Error guardando capturados en DB:", error.message, error.details);
    } else {
      console.log("Guardado exitoso:", data);
    }
  }

  guardarCapturadosEnDB();

}, [capturados, usuarioid]);


  useEffect(() => {
    localStorage.setItem("favoritosMarvel", JSON.stringify(favoritos));
  }, [favoritos]);

  return (
    <MarvelContext.Provider value={{
      favoritos,
      setFavoritos,
      capturados,
      setCapturados,
      characters,
      loading,
      error,
    }}>
      {children}
    </MarvelContext.Provider>
  );
}
