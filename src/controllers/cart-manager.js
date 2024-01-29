const fs = require("fs").promises;

class CartManager {
  static ultId = 0;

  constructor(path) {
    this.carts = [];
    this.path = path;
  }

  async createCart() {
    try {
      const arrayCarts = await this.readCartsFile();

      // Si arrayCarts no es un array, inicialízalo como un array vacío
      const cartsArray = Array.isArray(arrayCarts) ? arrayCarts : [];

      // Obtén el último ID existente
      const lastId = cartsArray.length > 0 ? cartsArray[cartsArray.length - 1].id : 0;

      const newCart = {
        id: lastId + 1,
        products: []
      };

      cartsArray.push(newCart);

      // Almacena el array de carritos directamente en el archivo
      await this.saveCartsFile(cartsArray);

      return newCart;
    } catch (error) {
      console.log("Error al crear un nuevo carrito", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
        const arrayCarts = await this.readCartsFile();
        const cartIndex = arrayCarts.findIndex(item => item.id === cartId);

        if (cartIndex !== -1) {
            const cart = arrayCarts[cartIndex];
            const existingProductIndex = cart.products.findIndex(item => item.product === productId);

            if (existingProductIndex !== -1) {
                // Si el producto ya existe en el carrito, incrementar la cantidad
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Si el producto no existe en el carrito, agregarlo
                cart.products.push({ product: productId, quantity });
            }

            await this.saveCartsFile(arrayCarts);
            console.log("Producto agregado al carrito");
        } else {
            console.log("No se encontró el carrito");
            throw new Error("Carrito no existe");
        }
    } catch (error) {
        console.log("Error al agregar producto al carrito", error);
        throw error;
    }
}


  async readCartsFile() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayCarts = JSON.parse(respuesta);
      return arrayCarts;
    } catch (error) {
      console.log("Error al leer el archivo de carritos", error);
      throw error;
    }
  }

  async getAllCarts() {
    try {
      const arrayCarts = await this.readCartsFile();
      return arrayCarts;
    } catch (error) {
      console.log("Error al obtener todos los carritos", error);
      throw error;
    }
  }
  
  async saveCartsFile(arrayCarts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo de carritos", error);
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const arrayCarts = await this.readCartsFile();
      const cart = arrayCarts.find(item => item.id === cartId);

      if (!cart) {
        console.log("Carrito no encontrado");
        return null;
      } else {
        console.log("Carrito encontrado");
        return cart;
      }
    } catch (error) {
      console.log("Error al leer el archivo de carritos", error);
      throw error;
    }
  }
}

module.exports = CartManager;
