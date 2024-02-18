const jwt = require("jsonwebtoken");

const chequearCredenciales = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).send({ message: "Faltan credenciales en la consulta" });
  }
  next();
};

const reportarSolicitudes = (req, res, next) => {
  const { email } = req.body;
  const url = req.url;
  console.log(
    `hoy ${new Date()} se ha recibido una consulta en la ruta ${url} del email: ${email}`
  );
  return next();
};
const reportarSolicitudesRegistro = (req, res, next) => {
  const { email, password, rol, lenguage } = req.body;
  const url = req.url;
  console.log(
    `hoy ${new Date()} se ha recibido una consulta en la ruta ${url} con los parametros: email: ${email}, rol: ${rol}, lenguaje: ${lenguage}`
  );
  return next();
};

const verificarToken = (req, res, next) => {
  const Authorization = req.header("Authorization");
  console.log(Authorization)
  const token = Authorization.split("Bearer ")[1];
  const verificacion = jwt.verify(token, "market23");
  if (!verificacion) {
    console.log("token no valido");
  }

  next();
};
module.exports = { chequearCredenciales, reportarSolicitudes, reportarSolicitudesRegistro,verificarToken};
