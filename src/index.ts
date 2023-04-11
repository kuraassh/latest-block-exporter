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

function createAvalancheRouter() {
    const avalancheRPCManager = getRPCManagers(process.env.AVALANCHE_RPC);
    const avalancheLatestRPCManager = new RPCManager("https://1rpc.io/avax/c");
    const avalancheManager = new AnyBlockchainMetricsManager(avalancheRPCManager, formatter, "avalanche", avalancheLatestRPCManager);
    const avalancheRouter = routerFactory.make(avalancheManager);
    return avalancheRouter;
}

function createOptimismRouter() {
    const optimismRPCManager = getRPCManagers(process.env.OPTIMISM_RPC);
    const optimismLatestRPCManager = new RPCManager("https://1rpc.io/op");
    const optimismManager = new AnyBlockchainMetricsManager(optimismRPCManager, formatter, "optimism", optimismLatestRPCManager);
    const optimismRouter = routerFactory.make(optimismManager);
    return optimismRouter;
}

function createArbitrumNitroRouter() {
    const arbitrumRPCManager = getRPCManagers(process.env.ARBITRUM_NITRO_RPC);
    const arbitrumLatestRPCManager = new RPCManager("https://arb1.arbitrum.io/rpc");
    const arbitrumManager = new AnyBlockchainMetricsManager(arbitrumRPCManager, formatter, "arbitrum_nitro", arbitrumLatestRPCManager);
    const arbitrumRouter = routerFactory.make(arbitrumManager);
    return arbitrumRouter;
}

function createCeloRouter() {
    const celoRPCManager = getRPCManagers(process.env.CELO_RPC);
    const celoLatestRPCManager = new RPCManager("https://forno.celo.org");
    const celoManager = new AnyBlockchainMetricsManager(celoRPCManager, formatter, "celo", celoLatestRPCManager);
    const celoRouter = routerFactory.make(celoManager);
    return celoRouter;
}

function createPolygonRouter() {
    const polygonRPCManager = getRPCManagers(process.env.POLYGON_RPC)
    const polygonLatestRPCManager = new RPCManager("https://polygon-mainnet.public.blastapi.io")
    const polygonManager = new AnyBlockchainMetricsManager(polygonRPCManager, formatter, "polygon", polygonLatestRPCManager);
    const polygonRouter = routerFactory.make(polygonManager);
    return polygonRouter;
}

function createGnosisRouter() {
    const gnosisRPCManager = getRPCManagers(process.env.GNOSIS_RPC);
    const gnosisLatestRPCManager = new RPCManager("https://gnosis-mainnet.public.blastapi.io");
    const gnosisManager = new AnyBlockchainMetricsManager(gnosisRPCManager, formatter, "gnosis", gnosisLatestRPCManager);
    const gnosisRouter = routerFactory.make(gnosisManager);
    return gnosisRouter;
}

// Gnosis
const gnosisRouter = createGnosisRouter();
app.use('/gnosis', gnosisRouter)

// Polygon
const polygonRouter = createPolygonRouter();
app.use('/polygon', polygonRouter)

// Celo
const celoRouter = createCeloRouter();
app.use('/celo', celoRouter)

// Optimism
const optimismRouter = createOptimismRouter();
app.use('/optimism', optimismRouter)

// Arbitrum Nitro
const arbitrumRouter = createArbitrumNitroRouter();
app.use('/arbitrum-nitro', arbitrumRouter)

// Avalanche
const avalancheRouter = createAvalancheRouter();
app.use('/avalanche', avalancheRouter)

const graphManager = new GraphManager(
    new SubgraphManager("https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-mainnet"),
    new SubgraphManager("https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-goerli")
)

const allocationRouterFactory = new AllocationRouterFactory(graphManager, formatter)
app.use('/allocation', allocationRouterFactory.make())

const walletRouterFactory = new WalletRouterFactory(graphManager, formatter);
app.use('/wallet', walletRouterFactory.make())

const configRouterFactory = new ConfigRouterFactory(formatter)
app.use('/config', configRouterFactory.make())

app.listen(8081)