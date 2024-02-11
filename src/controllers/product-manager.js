const fs = require("fs").promises;

class ProductManager {

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  static lastId = 0;

  async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
    try {
      const arrayProducts = await this.readArchive();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos tienen que estar completos para crear el producto");
        return;
      }

      if (arrayProducts.some(item => item.code === code)) {
        console.log("El código de producto indicado ya está registrado");
        return;
      }

      const newProduct = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || []
      };

      if (arrayProducts.length > 0) {
        ProductManager.lastId = arrayProducts.reduce((maxId, product) => Math.max(maxId, product.id), 0);
      }

      newProduct.id = ++ProductManager.lastId;

      arrayProducts.push(newProduct);
      await this.saveArchive(arrayProducts);
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const arrayProducts = await this.readArchive();
      return arrayProducts;
    } catch (error) {
      console.log("Error al obtener el producto", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const arrayProducts = await this.readArchive();
      const searchedProduct = arrayProducts.find(item => item.id === id);

      if (!searchedProduct) {
        console.log("El producto con el ID solicitado no existe");
        return null;
      } else {
        console.log("El producto con el ID solicitado fue encontrado");
        return searchedProduct;
      }
    } catch (error) {
      console.log("Error al obtener el producto", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProducts = await this.readArchive();

      const index = arrayProducts.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProducts[index] = { ...arrayProducts[index], ...updatedProduct };
        await this.saveArchive(arrayProducts);
        console.log("Producto actualizado con éxito");
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {

      const arrayProducts = await this.readArchive();
      const index = arrayProducts.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProducts.splice(index, 1);
        await this.saveArchive(arrayProducts);
        console.log("Producto eliminado con éxito");
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }

  async readArchive() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const arrayProducts = JSON.parse(response);
      return arrayProducts;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async saveArchive(arrayProducts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
      throw error;
    }
  }

}

module.exports = ProductManager;