import { PrismaClient } from "@prisma/client";
import { Product } from "../../entities/product";
import { ProductRepository } from "./product.repository";

export class ProductsRepositoryPrisma implements ProductRepository {
    constructor(readonly prisma: PrismaClient) { }

    public static build(prisma: PrismaClient) {
        return new ProductsRepositoryPrisma(prisma);
    }

    public async save(product: Product): Promise<void> {
        await this.prisma.product.create({
            data: {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
            }
        });
    }
    public async findById(id: string): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new Error("Product not found");
        }

        return Product.with({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity
        });
    }
    public async update(product: Product): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async list(): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

}
