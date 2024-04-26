import express from 'express'
import ProductManager from './productManager.js';


const app = express();
const PORT = 8080

const ready = () => console.log('server ready on port ' + PORT)

// Middleware para parsear JSON.
app.use(express.json());

// Instanciar ProductManager
const manager = new ProductManager('./src/products.json');

//End Points
app.get('/products', (req, res) => {
    const { limit } = req.query; // Captura el parámetro de consulta 'limit'
    let products = manager.getProducts();
    if (limit) {
        products = products.slice(0, Number(limit));
    }
    res.json({ products });
});

app.get('/products/:pid', (req, res) => {
    const { pid } = req.params; // Captura el parámetro de ruta 'pid'
    const product = manager.getProductById(Number(pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

app.post('/products', async (req, res) => {
    try {
        await manager.addProduct(req.body);
        res.status(201).send('Producto creado con éxito');
    } catch (error) {
        res.status(500).send('Error al crear el producto: ' + error.message);
    }
});

app.put('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await manager.updateProduct(Number(pid), req.body);
        res.send('Producto actualizado con éxito');
    } catch (error) {
        res.status(500).send('Error al actualizar el producto: ' + error.message);
    }
});

app.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await manager.deleteProduct(Number(pid));
        res.send('Producto eliminado con éxito');
    } catch (error) {
        res.status(500).send('Error al eliminar el producto: ' + error.message);
    }
});



app.listen(PORT, ready);



