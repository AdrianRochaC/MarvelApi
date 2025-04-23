// Filtro/index.jsx
function Filtro({ onTipoChange }) {
  const tipos = [
    "All",
    "Heroes",  // Para mostrar sólo héroes
    "Villains"  // Para mostrar sólo villanos
  ];

  return (
    <div className="c-filtro">
      {tipos.map((unTipo, index) => (
        <button className='' key={index} onClick={() => onTipoChange(unTipo)}>
          {unTipo}
        </button>
      ))}
    </div>
  );
}

export default Filtro;
