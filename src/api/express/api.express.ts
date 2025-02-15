import { Api } from "../api";
import express, { Express, Request, Response } from "express";

export class ApiExpress implements Api {
    private constructor(private readonly app: Express) { }

    public static build(): ApiExpress {
        const app = express();
        app.use(express.json());
        return new ApiExpress(app);
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            this.printRoutes();
        });
    }

    public addRoute(route: string, method: "get" | "post" | "put" | "delete", handle: (req: Request, res: Response) => void): void {
        this.app[method](route, handle);
    }

    private printRoutes(): void {
        this.app._router.stack.forEach((r: any) => {
            if (r.route) {
                console.log(r.route);
            }
        });
    }
}
