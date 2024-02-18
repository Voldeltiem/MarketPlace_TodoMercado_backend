//acceso a la base de datos 
const { Pool } = require("pg");

const pool = new Pool({
  host: "dpg-cn7qjjmn7f5s73c8vo60-a",
  port: 5432,
  user: "admin",
  password: "vV2VrnsRQQcQuFfMSubKI0v1WjuhKUr2", //"Knight123"
  database: "market_place_zfy4",
  allowExitOnIdle: true,
});

module.exports = {pool};