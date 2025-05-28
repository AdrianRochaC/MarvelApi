import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import './style.css';

export default function Usuario() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    fecha_nacimiento: "",
    telefono: "",
    roll: ""
  });

  const [nuevaUrl, setNuevaUrl] = useState("");
  const [imagenes, setImagenes] = useState([]);

  // Obtener datos del usuario
  useEffect(() => {
    async function fetchUsuario() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("usuario")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) {
          setUsuario(data);
          setForm(data);
          fetchImagenes(user.id);
        }
      }
    }
    fetchUsuario();
  }, []);

  const fetchImagenes = async (usuarioid) => {
    const { data, error } = await supabase
      .from("multimedia")
      .select("*")
      .eq("usuarioid", usuarioid);
    if (data) setImagenes(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("usuario")
      .update(form)
      .eq("id", usuario.id);
    if (error) alert("Error al actualizar");
    else alert("Datos actualizados");
  };

  const handleAgregarUrl = async () => {
    if (!nuevaUrl.trim()) return;

    const { error } = await supabase
      .from("multimedia")
      .insert([{ url: nuevaUrl, usuarioid: usuario.id }]);
    if (error) {
      alert("Error al agregar la imagen");
    } else {
      setNuevaUrl("");
      fetchImagenes(usuario.id);
    }
  };

  const handleEliminarImagen = async (id) => {
    const { error } = await supabase
      .from("multimedia")
      .delete()
      .eq("id", id);
    if (!error) {
      setImagenes(imagenes.filter((img) => img.id !== id));
    }
  };

  //cerrar sesion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  if (!usuario) return <p className="r-register-text">Cargando...</p>;

  return (
    <section className="r-register-container">
      <h2 className="r-register-title">Perfil de Usuario</h2>
      
      <form className="r-register-form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <label>
          Nombre:
          <input name="nombre" value={form.nombre} onChange={handleChange} required />
        </label>

        <label>
          Correo:
          <input name="correo" value={form.correo} onChange={handleChange} required />
        </label>

        <label>
          Fecha de nacimiento:
          <input
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Teléfono:
          <input name="telefono" value={form.telefono} onChange={handleChange} required />
        </label>

        <label>
          Rol:
          <input name="roll" value={form.roll} onChange={handleChange} required />
        </label>

        <button type="submit" className="r-register-button">Guardar cambios</button>
      </form>

      <hr />

      <h3 className="r-register-title" style={{ fontSize: "1.5rem" }}>Agregar imagen</h3>
      <div className="r-register-form" style={{ flexDirection: "row", gap: "10px" }}>
        <input
          type="text"
          placeholder="URL de la imagen"
          value={nuevaUrl}
          onChange={(e) => setNuevaUrl(e.target.value)}
          className="r-register-input-url"
        />
        <button className="r-register-button" onClick={handleAgregarUrl}>Agregar</button>
      </div>

      <h3 className="r-register-title" style={{ fontSize: "1.5rem", marginTop: "20px" }}>Imágenes guardadas</h3>
      <ul className="imagenes-list">
        {imagenes.map((img) => (
          <li key={img.id} className="imagen-item">
            <img src={img.url} alt="Imagen" width="150" className="imagen" />
            <button className="r-register-nav-button" onClick={() => handleEliminarImagen(img.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <hr />

      <h2 className="r-register-title" style={{ fontSize: "1.5rem" }}>Quiero cerrar sesión</h2>
      <button className="r-register-button" onClick={handleLogout}>Cerrar sesión</button>

      {/* Saltos de línea para que el menú no tape el botón */}
      <br /><br /><br /><br /><br />
    </section>
  );
}
