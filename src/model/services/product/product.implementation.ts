import { ProductRepository } from "../../repositories/product.repository";
import { BuyOutputDto, ListOutputDto, ProductService, SellOutputDto } from "./product.service";

export class ProductImplementation implements ProductService {
    private constructor(private readonly productRepository: ProductRepository) {

    }
    public async sell(id: string, amount: number): Promise<SellOutputDto> {
        const aProduct = await this.productRepository.findById(id);
        if (!aProduct) {
            throw new Error("Product not found");
        }
        if (aProduct.quantity < amount) {
            throw new Error("Insufficient balance");
        }
        aProduct.sell(amount);

        await this.productRepository.update(aProduct);

        const output: SellOutputDto = {
            id,
            balance: aProduct.quantity,
        };

        return output;
    }
    public async buy(id: string, amount: number): Promise<BuyOutputDto> {
        const aProduct = await this.productRepository.findById(id);
        if (!aProduct) {
            throw new Error("Product not found");
        }
        if (aProduct.quantity < amount) {
            throw new Error("Insufficient balance");
        }
        aProduct.buy(amount);

        await this.productRepository.update(aProduct);

        const output: BuyOutputDto = {
            id,
            balance: aProduct.quantity,
        };

        return output;
    }
    public async list(): Promise<ListOutputDto> {
        const aProducts = await this.productRepository.list();
        const output: ListOutputDto = {
            products: aProducts.map((aProduct) => ({
                id: aProduct.id,
                name: aProduct.name,
                price: aProduct.price,
                quantity: aProduct.quantity,
            })),
        };

        return output;
    }

}
