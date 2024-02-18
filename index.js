const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const {
    chequearCredenciales,
    verificarToken,
    reportarSolicitudes,
    reportarSolicitudesRegistro,
} = require("./middlewares/middlewares");
const app = express();
const PORT = "3000";
app.listen(PORT, console.log(`¡Servidor ${PORT} encendido!`));
app.use(express.json());
app.use(cors());
const {
    verificarUsuario,
    obtenerDatosUsuario,
    agregarUsuario,
    deleteUsuario,
    modificarPassword,
    verificarCorreo,
} = require("./controllers/usuarios.js");
const {
    obtenerPublicacionUsuario,
    obtenerPublicaciones,
    crearNuevaPublicacion, obtenerPublicacionPorId, borrarPublicacionPorId, modificarPublicacion, getpublicacionesByFiltros,
} = require("./controllers/productos");
const { agregarFavorito,
    eliminarFavorito,
    obtenerFavoritosUsuario,
    obtenerPublicacionesFavoritas } = require("./controllers/favoritos.js")


app.post("/registro", cors(), async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;
        await verificarCorreo(email);
        console.log(req.body);
        await agregarUsuario(nombre, email, password, telefono);
        res.send("Usuario creado con exito");
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});
app.post(
    "/login",
    chequearCredenciales,
    reportarSolicitudes,
    cors(),
    async (req, res) => {
        try {
            const { email, password } = req.body;
            await verificarUsuario(email, password);
            const token = jwt.sign({ email }, "market23");
            console.log(`este es el token: ${token}`);
            res.send(token);
        } catch (error) {
            res.status(500).send(error);
            console.log("no es posible ejecutar el requerimiento");
        }
    }
);

app.get("/perfil", verificarToken, cors(), async (req, res) => {
    try {
        const Authorization = req.header("Authorization");
        console.log(Authorization);
        const token = Authorization.split("Bearer ")[1];
        console.log(token);
        const { email } = jwt.decode(token);

        //const { email } = req.body;
        console.log(email);
        const usuario = await obtenerDatosUsuario(email);
        res.send(usuario);
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});

app.delete("/perfil", verificarToken, cors(), async (req, res) => {
    try {
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1];
        const { email } = jwt.decode(token);
        console.log(email);
        //const {email} = req.query
        const usuario = await deleteUsuario(email);
        res.send("usuario borrado");
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});

app.patch('/perfil', async (req, res) => {
    try {
        console.log("aqui");
        const { email, password, newpassword } = req.body;
        console.log(newpassword);
        console.log(email);
        await verificarUsuario(email, password);
        await modificarPassword(email, newpassword);
        res.send('Operación PATCH en /perfil exitosa');
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});
// productos vista home
app.get("/", cors(), async (req, res) => {
    try {
        const { limits, campo, order, page } = req.query
        console.log(order)
        const productos = await obtenerPublicaciones({ limits, campo, order, page });
        res.send(productos);
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});

//productos filtrados

app.get("/filtros", async (req, res) => {
    try {
        const queryStrings = req.query;
        console.log(req.query);
        const productos = await getpublicacionesByFiltros(queryStrings);
        res.send(productos);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

//Obtien las publicaciones del usuario
app.post("/misPublicaciones", cors(), async (req, res) => {
    try {
        const id_usuario = req.body.id_usuario;
        // console.log(`el id ${id_usuario} se obtiene`)
        const productos = await obtenerPublicacionUsuario(id_usuario);
        res.send(productos);
    } catch (error) {
        res.status(500).send(error);
        console.log("No es posible ejecutar el requerimiento");
    }
});

//agregar publicacion nueva
app.post("/nuevaPublicacion", cors(), async (req, res) => {
    try {
        const { nombre_producto, descripcion, precio, id_usuario, url } = req.body;

        console.log(req.body);
        await crearNuevaPublicacion(
            nombre_producto,
            descripcion,
            precio,
            id_usuario,
            url
        );
        res.send("producto creado con exito");
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});
//obtener detalles de publicacion
app.get("/publicacionDetalle/:id", cors(), async (req, res) => {
    try {
        const { id } = req.params
        const productos = await obtenerPublicacionPorId(id);
        res.send(productos);
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});

//borrar publicacion
app.delete("/mispublicaciones/:id_producto", cors(), async (req, res) => {
    try {
        const { id_producto } = req.params;
        console.log(id_producto)
        const productos = await borrarPublicacionPorId(id_producto);
        res.send(productos);
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});

//editar publicacion
app.put("/editarPublicacion", cors(), async (req, res) => {
    try {
        const { nombre_producto, descripcion, precio, url, id } = req.body
        console.log(id)
        const productos = await modificarPublicacion(nombre_producto, descripcion, precio, url, id);
        res.send(productos);
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});

//guardar favorito
app.post('/favoritos', cors(), async (req, res) => {
    const { id_usuario, id_producto } = req.body;
    // console.log(`producto: ${id_producto} usuario: ${id_usuario}`);
    const favorito = await agregarFavorito(id_usuario, id_producto);
    res.send(favorito)
});

//eliminar favorito
app.delete('/favoritos/:id_usuario/:id_producto', async (req, res) => {
    const { id_usuario, id_producto } = req.params;
    // console.log(`producto: ${id_producto} usuario: ${id_usuario}`);
    const favorito = await eliminarFavorito(id_usuario, id_producto);
    res.send(favorito)
});

// Ruta para obtener favoritos de un usuario
app.post('/favoritosusuario', async (req, res) => {
    try {
        const { id_usuario } = req.body;
        // console.log(id_usuario)
        const favoritos = await obtenerFavoritosUsuario(id_usuario);
        // console.log('Favoritos obtenidos:', favoritos.length);
        if (favoritos.length === 0) {
            // No se encontraron favoritos
            res.json({ mensaje: 'No se encontraron favoritos para el usuario.' });
        } else {
            // Se encontraron favoritos
            res.json({ favoritos });
        }
    } catch (error) {
        console.error('Error al obtener favoritos del usuario:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//publicaciones favoritas de lusuario
app.get("/favoritos", cors(), async (req, res) => {
    try {
        const { id_usuario } = req.query
        const productos = await obtenerPublicacionesFavoritas( id_usuario );
        res.send(productos);
    } catch (error) {
        res.status(500).send(error);
        console.log("no es posible ejecutar el requerimiento");
    }
});