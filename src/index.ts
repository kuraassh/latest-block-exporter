import express from 'express'
import axios from "axios";
import { RPCManager } from './rpc';
import { RouterFactory } from './roter';
import { Formatter } from './formatter';
import { AnyBlockchainMetricsManager } from './blockchains/blockchain';
import { WalletFetcher } from './wallet';
import { WalletRouterFactory } from './wallet/router';
import { AllocationRouterFactory } from './allocation/router';
import { GraphManager, SubgraphManager } from './allocation';
import { ConfigRouterFactory } from './config/router';

const app = express()

const formatter = new Formatter()
const routerFactory = new RouterFactory()

function getRPCManagers(env: string | undefined): RPCManager[] {
    if (!env) {
        return []
    }

    // Remove spaces and split
    const rpcs = env.replace(/\s/g, "").split(",")
    const rpcManagers = rpcs.map(rpc => new RPCManager(rpc))
    return rpcManagers
}

function createArbitrumNitroRouter() {
    const arbitrumRPCManager = getRPCManagers(process.env.ARBITRUM_NITRO_RPC);
    const arbitrumLatestRPCManager = new RPCManager("https://arb1.arbitrum.io/rpc");
    const arbitrumManager = new AnyBlockchainMetricsManager(arbitrumRPCManager, formatter, "arbitrum_nitro", arbitrumLatestRPCManager);
    const arbitrumRouter = routerFactory.make(arbitrumManager);
    return arbitrumRouter;
}

// Arbitrum Nitro
const arbitrumRouter = createArbitrumNitroRouter();
app.use('/arbitrum-nitro', arbitrumRouter)

const graphManager = new GraphManager(
    new SubgraphManager("https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-mainnet"),
    new SubgraphManager("https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-arbitrum")
)

const allocationRouterFactory = new AllocationRouterFactory(graphManager, formatter)
app.use('/allocation', allocationRouterFactory.make())

const walletRouterFactory = new WalletRouterFactory(graphManager, formatter);
app.use('/wallet', walletRouterFactory.make())

const configRouterFactory = new ConfigRouterFactory(formatter)
app.use('/config', configRouterFactory.make())

app.listen(8081)