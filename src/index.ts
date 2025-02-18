import { ApiExpress } from "./api/express/api.express";
import { ProductController } from "./api/express/controllers/product.controller";

function main() {
    const api = ApiExpress.build();

    const aProductController = ProductController.build();
    api.addRoute("/health", "get", (req, res) => {
        res.status(200).json({ message: "OK" });
    });
    api.addRoute("/products", "post", aProductController.create);
    api.addRoute("/products", "get", aProductController.list);
    api.start(4731);
}

main();

