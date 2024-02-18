const verificarToken = (req, res, next) => {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    const verificacion = jwt.verify(token, "mercadito69");
    if (verificacion) {
      console.log("token valido");
    }
  
    next();
  };
  module.exports = verificarToken;