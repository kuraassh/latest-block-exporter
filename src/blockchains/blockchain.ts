import { Formatter } from "../formatter"
import { RPCManager } from "../rpc"

export interface BlockchainMetricsManager {
    getLatestBlockMetrics(): Promise<string>
    getCurrentBlockMetrics(): Promise<string>
}

export class AnyBlockchainMetricsManager implements BlockchainMetricsManager {
    protected rpcManager: RPCManager
    protected latestRPCManager: RPCManager
    protected formatter: Formatter
    protected blockchainName: string

    constructor(rpcManager: RPCManager, formatter: Formatter, blockchainName: string, latestRPCManager: RPCManager) {
        this.rpcManager = rpcManager
        this.formatter = formatter

        this.latestRPCManager = latestRPCManager
        this.blockchainName = blockchainName
    }

    async getLatestBlockMetrics(): Promise<string> {
        const currentBlock = await this.latestRPCManager.fetchBlockFromRPC()
        const formattedResponse = this.formatter.formatLatest(this.blockchainName, currentBlock)
        return formattedResponse
    }

    async getCurrentBlockMetrics(): Promise<string> {
        const currentBlock = await this.rpcManager.fetchBlockFromRPC()
        const formattedResponse = this.formatter.formatCurrent(this.blockchainName, currentBlock)
        return formattedResponse
    }
}