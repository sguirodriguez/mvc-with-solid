export type ProductProps = {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export class Product {
    private constructor(
        readonly props: ProductProps
    ) { }

    static create(name: string, price: number): Product {
        return new Product({
            id: crypto.randomUUID().toString(),
            name,
            price,
            quantity: 0
        });
    }

    public static with(props: ProductProps): Product {
        return new Product(props);
    }

    public get id() {
        return this.props.id;
    }

    public get name() {
        return this.props.name;
    }

    public get price() {
        return this.props.price;
    }

    public get quantity() {
        return this.props.quantity;
    }

    public buy(quantity: number) {
        this.props.quantity += quantity;
    }

    public sell(quantity: number) {
        this.props.quantity -= quantity;
    }
} 