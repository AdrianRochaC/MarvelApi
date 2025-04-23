// utils/marvelAPI.js
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

// Fetch all characters
export const fetchAllCharacters = async (limit = 100) => {
  const url = `${MARVEL_API_BASE}/characters?limit=${limit}&${getAuthParams()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data.results;
};

// Fetch character by ID
export const fetchCharacterById = async (id) => {
  const url = `${MARVEL_API_BASE}/characters/${id}?${getAuthParams()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.data.results[0];
};
