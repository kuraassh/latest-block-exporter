import { Router } from "express";
import { Formatter } from "../formatter";

type ConfigEntry = {
    name: string
    network: Network
    value: number
}

export class ConfigRouterFactory {
    private formatter: Formatter

    constructor(formatter: Formatter) {
        this.formatter = formatter
    }

    private createConfigEntry(name: string, network: Network, value: number): ConfigEntry {
        return {
            name: `config_${name}`,
            network: network,
            value: value,
        }
    }

    private createBalanceConfigEntry(network: Network, value: number): ConfigEntry {
        return this.createConfigEntry("balance_threshold", network, value);
    }

    private createBalanceConfig(): ConfigEntry[] {
        return [
            this.createBalanceConfigEntry("eth-mainnet", 0.1),
            this.createBalanceConfigEntry("eth-goerli", 0.5),
        ]
    }

    private createAllocationConfigEntry(network: Network, value: number): ConfigEntry {
        return this.createConfigEntry("allocation_max_duration", network, value);
    }

    private createAllocationConfig(): ConfigEntry[] {
        return [
            this.createAllocationConfigEntry("eth-mainnet", 28),
            this.createAllocationConfigEntry("eth-goerli", 4),
        ]
    }

    private createConfig(): ConfigEntry[] {
        return [
            ...this.createBalanceConfig(),
            ...this.createAllocationConfig(),
        ]
    }

    public make(): Router {
        const router = Router();

        router.get('/generate', (req, res) => {
            const config = this.createConfig();
            const formatted = config.map((entry) => {
                return this.formatter.formatConfig(entry.name, entry.network, entry.value);
            }).join("\n\n");

            res.send(formatted);
        });

        return router;
    }
}