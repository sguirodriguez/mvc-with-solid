import { ProductsRepositoryPrisma } from "../../../model/repositories/product/products.repository.prisma";
import { ProductServiceImplementation } from "../../../model/services/product/product.service.implementation";
import prisma from "../../../util/prisma.utils";
import { Request, Response } from "express";

export class ProductController {
    private constructor() {
    }

    public static build(): ProductController {
        return new ProductController();
    }

    public async create(req: Request, res: Response) {
        const { name, price } = req.body;
        const aRepository = ProductsRepositoryPrisma.build(prisma);
        const aService = ProductServiceImplementation.build(aRepository);

        const output = await aService.create(name, price);
        const data = {
            id: output.id,
            name: output.name,
            price: output.price,
            quantity: output.quantity,
        };

        return res.status(201).json(data).send();
    }

    public async list(_req: Request, res: Response) {
        const aRepository = ProductsRepositoryPrisma.build(prisma);
        const aService = ProductServiceImplementation.build(aRepository);

        const output = await aService.list();
        const data = {
            products: output.products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
            })),
        };

        return res.status(200).json(data).send();
    }
}
