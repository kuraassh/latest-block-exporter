import axios from "axios";

type RPCBlockResponse = {
    jsonrpc: string
    id: number
    result: string
}

export class RPCManager {
    private rpc: string | undefined

    constructor(rpc?: string) {
        this.rpc = rpc
    }

    async fetchBlockFromRPC(): Promise<number> {
        // Throw if RPC URL is undefined or null or empty string
        if (!this.rpc) {
            throw new Error("RPC URL is undefined")
        }

        const body = {"jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 1}
        const response = await axios.post(this.rpc, body)
        const data = response.data as RPCBlockResponse
        return parseInt(data.result)
    }
}