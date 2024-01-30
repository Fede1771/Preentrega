const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("../src/controllers/product-manager.js");
const CartManager = require("../src/controllers/cart-manager.js");
const productManager = new ProductManager("./src/models/productos.json");
const cartManager = new CartManager("./src/models/carrito.json");

app.use(express.json());

//Sector Productos

//Listar todos los productos
app.get("/api/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const productos = await productManager.getProducts();

        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

//Traer un solo producto por id: 
app.get("/api/products/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        const producto = await productManager.getProductById(parseInt(id));
        if (!producto) {
            res.json({
                error: "Producto no encontrado"
            });
        } else {
            res.json(producto);
        }

    } catch (error) {
        console.log("Error al obtener el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

//Agregar un nuevo producto por post: 
app.post("/api/products", async (req, res) => {
    const nuevoProducto = req.body; 
    console.log(nuevoProducto);

    try {
        await productManager.addProduct(nuevoProducto),
        res.status(201).json({message: "Producto agregado exitosamente"});
    } catch (error) {
        console.log("error al agregar un producto ", error);
        res.status(500).json({error: "error del servidor"});
    }
})

//Actualizamos producto por id: 
app.put("/api/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid);
    const productoActualizado = req.body;

    try {
        const productoModificado = await productManager.updateProduct(id, productoActualizado);

        if (productoModificado) {
            res.json({ message: "Producto actualizado correctamente" });
        } else {
            res.json({ message: "Producto no encontrado o eliminado correctamente" });
        }
    } catch (error) {
        console.log("No pudimos actualizar", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});


// Eliminar un producto por id
app.delete("/api/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid);

    try {
        const productoEliminado = await productManager.deleteProduct(id);

        if (productoEliminado) {
            res.json({
                message: "Producto eliminado correctamente",
                deletedProduct: productoEliminado
            });
        } else {
            res.status(404).json({
                error: "Producto no encontrado"
            });
        }
    } catch (error) {
        console.log("Error al eliminar el producto", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});


//Sector Carrito

// Crear un nuevo carrito
app.post("/api/carts", async (req, res) => {
    try {
      const newCart = await cartManager.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el carrito' });
    }
  });

  // Ruta para obtener todos los carritos
app.get("/api/carts", async (req, res) => {
    try {
      const allCarts = await cartManager.getAllCarts();
  
      res.json(allCarts);
    } catch (error) {
      console.log("Error al obtener todos los carritos", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  });
  
// Ver productos en el carrito
app.get("/api/carts/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }

        const productId = parseInt(req.params.pid);
        const product = cart.products.find(item => item.product === productId);

        if (!product) {
            res.status(404).json({ error: "Producto no encontrado en el carrito" });
            return;
        }

        res.json(product);
    } catch (error) {
        console.log("Error al obtener producto del carrito", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

// Ruta para obtener los productos de un carrito específico
app.get("/api/carts/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
  
    try {
      const cart = await cartManager.getCartById(cartId);
  
      if (!cart) {
        res.status(404).json({ error: "Carrito no encontrado" });
        return;
      }
  
      res.json(cart.products);
    } catch (error) {
      console.error("Error al obtener productos del carrito", error);
      res.status(500).json({ error: "Error del servidor" });
    }
});

//Ruta para agregar productos al carrito
  app.post("/api/carts/:cid/products/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity);

    try {
        await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json({ message: "Producto agregado al carrito correctamente" });
    } catch (error) {
        if (error.message === "Carrito no existe") {
            res.status(404).json({ error: "Carrito no existe" });
        } else {
            console.log("Error al agregar producto al carrito", error);
            res.status(500).json({ error: "Error del servidor" });
        }
    }
});

app.listen(PUERTO);
