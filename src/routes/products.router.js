const express = require("express"); 
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

//Listar todos los productos:

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

//Listar solo un producto por ID:

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        const product = await productManager.getProductById(parseInt(id));
        if (!product) {
            res.json({
                error: "Producto no encontrado"
            });
        } else {
            res.json(product);
        }

    } catch (error) {
        console.log("Error al obtener el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

//Agregamos producto por post: 

router.post("/", async (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);

    try {
        await productManager.addProduct(newProduct),
            res.status(201).json({ message: "Producto agregado exitosamente" });
    } catch (error) {
        console.log("Error al agregar el producto ", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

//Actualizamos producto por id: 

router.put("/:pid", async (req, res) => {
    let id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(parseInt(id), updatedProduct);
        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.log("Error al actualizar el producto ", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

//Eliminamos producto por id: 

router.delete("/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        await productManager.deleteProduct(parseInt(id));
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.log("Error al eliminar el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

//Exportamos el módulo

module.exports = router; 
