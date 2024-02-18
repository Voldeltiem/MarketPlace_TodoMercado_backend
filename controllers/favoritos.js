const { pool } = require("../db");

//guardar favoritos
//creo que seria asi la sintaxis no la e comprobado
const agregarFavorito = async (id_usuario, id_producto) => {
  const consulta = "INSERT INTO favoritos VALUES (DEFAULT,$1, $2)";
  const values = [id_usuario, id_producto];
  const {
    rows: [favoritos],
  } = await pool.query(consulta, values);
  return favoritos;
};

//eliminar favoritos
const eliminarFavorito = async (id_usuario, id_producto) => {
  const consulta =
    "DELETE FROM favoritos WHERE id_usuario = $1 AND id_producto = $2";
  const { rowCount } = await pool.query(consulta, [
    id_usuario,
    id_producto,
  ]);
};

//Obtener Favoritos de un usuario
const obtenerFavoritosUsuario = async (id_usuario) => {
  try {
    // console.log(id_usuario)
    const consulta = "SELECT * FROM favoritos WHERE id_usuario = $1";
    const { rows: favoritos, rowCount } = await pool.query(consulta, [id_usuario]);

    if (rowCount === 0) {
      console.log('No se encontraron favoritos para el usuario.');
      return []; // Retorna un array vacío si no hay favoritos.
    }

    return favoritos;
  } catch (error) {
    console.error('Error al obtener favoritos del usuario:', error);
    throw error; 
  }
};

//obtiene publicaciones favoritas del usuario
const obtenerPublicacionesFavoritas = async (id_usuario) => {
  const consulta = `
  SELECT *
  FROM productos
  INNER JOIN favoritos ON productos.id_producto = favoritos.id_producto
  WHERE favoritos.id_usuario = $1;`;
  const {
      rows: publicacionesFavoritas,
      rowCount,
  } = await pool.query(consulta, [id_usuario]);
  return publicacionesFavoritas;
};


module.exports = {
  agregarFavorito,
  eliminarFavorito,
  obtenerFavoritosUsuario,
  obtenerPublicacionesFavoritas
};
