import { Product } from "../entities/product";

export interface ProductRepository {
    save(product: Product): Promise<void>;
    list(): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    update(product: Product): Promise<void>;
}