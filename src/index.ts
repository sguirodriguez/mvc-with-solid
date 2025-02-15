import { ApiExpress } from "./api/express/api.express";
import { ProductController } from "./api/express/controllers/product.controller";
function main() {
    const aApi = ApiExpress.build();

    const aProductController = ProductController.build();
    aApi.addRoute("/products", "post", aProductController.create);
    aApi.addRoute("/products", "get", aProductController.list);
    aApi.start(4731);
}

main();

