const express = require("express");
const router = express.Router(); 

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

//Listar todos los productos en sus respectivas cards:

router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();

        res.render("home", {productos: productos})
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({error: "Error del servidor"});
    }
})

//Mostrar todos los productos en tiempo real y también : 

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.log("Error en la vista en tiempo real", error);
        res.status(500).json({error: "Error del servidor"});
    }
})

//Exportamos el módulo

module.exports = router; 