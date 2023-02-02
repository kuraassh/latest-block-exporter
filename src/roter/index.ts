import { Router } from "express";
import { BlockchainMetricsManager } from "../blockchains/blockchain";

export class RouterFactory {
    make(manager: BlockchainMetricsManager): Router {
        const router = Router();

        router.get(`/latest`, async (req, res) => {
            try {
                const response = await manager.getLatestBlockMetrics();
                res.send(response);
            } catch (e) {
                console.log(e);
                res.statusCode = 500;
                res.send()
            }
        });

        router.get(`/current`, async (req, res) => {
            try {
                const response = await manager.getCurrentBlockMetrics();
                res.send(response);
            } catch (e) {
                console.log(e);
                res.statusCode = 500;
                res.send()
            }
        });

        return router;
    }
}