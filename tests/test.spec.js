//aqui se realizaran los tests
const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de marketplace", () => {

    it("estatus 500 con dato faltantes en el registro", async () => {
        const usuarioIncompleto = { nombre: "usuario1", email: "", password: "1234", telefono: 123456 }
        const { statusCode } = await request(server).post("/registro").send(usuarioIncompleto);
        expect(statusCode).toBe(500);
    });


    it("Obtener listado de productos", async () => {
        const { statusCode } = await request(server).get("/");

        // Esperamos un código de estado 200 para una solicitud exitosa
        expect(statusCode).toBe(200);
    })

    it("Inicio de sesión fallido con credenciales incorrectas", async () => {
        const credencialesIncorrectas = {
            email: "usuario_inexistente@dominio.com",
            password: "claveIncorrecta",
        };
        const { statusCode } = await request(server)
            .post("/login")
            .send(credencialesIncorrectas);
        expect(statusCode).toBe(500);
    });
    
    it("Intento de crear nueva publicación sin proporcionar token de autenticación", async () => {
        const newProductData = {
            nombre_producto: "Nuevo Producto",
            descripcion: "Descripción del producto",
            precio: 99.99,
            url: "https://ejemplo.com/imagen.jpg",
        };
        const { statusCode } = await request(server)
            .post("/publicaciones/:id")
            .send(newProductData);
        expect(statusCode).toBe(500);  
    });
});
