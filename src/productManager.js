import fs from 'fs/promises';

class ProductManager {
    constructor(path) {
        this.path = path; // Ruta del archivo de productos
        this.products = [];
        this.init();
    }

    async init() {
        await this.readJSONFile();
        this.nextProductId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    }

    async readJSONFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (e) {
            console.log("Error leyendo el archivo:", e);
            this.products = []; // Retorna un arreglo vacío si no puede leer el archivo
        }
    }

    async writeJSONFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (e) {
            console.log("Error escribiendo en el archivo:", e);
        }
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || product.stock == null) {
            console.log("Error: Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(p => p.code === product.code)) {
            console.log("Error: El código ya existe para otro producto.");
            return;
        }

        product.id = this.nextProductId++;
        this.products.push(product);
        await this.writeJSONFile();
        console.log(`Producto ${product.title} agregado con éxito.`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        return product || null;
    }

    async updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct, id: id };
            await this.writeJSONFile();
            console.log(`Producto con id ${id} actualizado con éxito.`);
        } else {
            console.log("Error: Producto no encontrado");
        }
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            await this.writeJSONFile();
            console.log(`Producto con id ${id} eliminado con éxito.`);
        } else {
            console.log("Error: Producto no encontrado");
        }
    }
}

export default ProductManager;