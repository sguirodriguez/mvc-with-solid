import { Product } from "./model/entities/product";

const product = Product.create("Product 1", 100, 10);
console.log(product.id);
console.log(product.name);
console.log(product.price);
console.log(product.quantity);
