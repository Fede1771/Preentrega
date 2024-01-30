const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
    try {
      const arrayProductos = await this.leerArchivo();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      if (arrayProductos.some(item => item.code === code)) {
        console.log("El código debe ser único");
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

      if (arrayProductos.length > 0) {
        ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
      }

      newProduct.id = ++ProductManager.ultId; 

      arrayProductos.push(newProduct);
      await this.guardarArchivo(arrayProductos);
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error; 
    }
  }
  async getProducts() {
    try {
      const arrayProductos = await this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find(item => item.id === id);

      if (!buscado) {
        console.log("Producto no encontrado");
        return null;
      } else {
        console.log("Producto encontrado");
        return buscado;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer un archivo", error);
      throw error;
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
      throw error;
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
        const arrayProductos = await this.leerArchivo();

        const index = arrayProductos.findIndex(item => item.id === id);

        if (index !== -1) {
            // Si el producto existe, actualízalo.
            arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
            await this.guardarArchivo(arrayProductos);
            console.log("Producto actualizado");
            return true;
        } else {
            // Si el producto no existe, elimínalo.
            console.log("No se encontró el producto");
            await this.deleteProduct(id);
            return false;
        }
    } catch (error) {
        console.log("Error al actualizar/eliminar el producto", error);
        throw error;
    }
}

  async deleteProduct(id) {
    try {
        const arrayProductos = await this.leerArchivo();

        const index = arrayProductos.findIndex(item => item.id === id);

        if (index !== -1) {
            const deletedProduct = arrayProductos.splice(index, 1)[0];
            await this.guardarArchivo(arrayProductos);
            console.log("Producto eliminado");
            return deletedProduct;
        } else {
            console.log("No se encontró el producto");
            return null;
        }
    } catch (error) {
        console.log("Error al eliminar el producto", error);
        throw error;
    }
}

}



module.exports = ProductManager;