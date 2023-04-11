function prometheusFormatBlock(name: string, blockchain: string, number: number) {
    return `#TYPE ${name} gauge\n${name}{blockchain="${blockchain}"} ${number}`
}

function splitAndCapitalise(str: string) {
    return str.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
}

function prometheusFormatCurrentBlock(name: string, blockchain: string, number: number, rpcHostname: string) {
    const blockchain_name = splitAndCapitalise(blockchain)
    const rpc_name = `${blockchain_name} (${rpcHostname})`

    return `#TYPE ${name} gauge\n${name}{blockchain="${blockchain}", name="${rpc_name}"} ${number}`
}

function prometheusFormatBalance(network: string, indexerAddress: string, operatorAddress: string, number: number) {
    return `#TYPE wallet_balance gauge\nwallet_balance{network="${network}", indexer_address="${indexerAddress}", operator_address="${operatorAddress}"} ${number}`
}

function prometheusFormatAllocation(network: string, indexer: string, name: string, ipfsHash: string, number: number) {
    return `#TYPE allocation_epoch gauge\nallocation_epoch{network="${network}", indexer="${indexer}", name="${ipfsHash} (${name})"} ${number}`
}

function prometheusFormatConfig(name: string, network: string, value: number) {
    return `#TYPE ${name} gauge\n${name}{network="${network}"} ${value}`
}

export class Formatter {
    formatLatest(blockchain: string, number: number) {
        return prometheusFormatBlock("latest_block", blockchain, number)
    }

    formatCurrent(blockchain: string, number: number, rpcHostname: string) {
        return prometheusFormatCurrentBlock("current_block", blockchain, number, rpcHostname)
    }

    formatBalance(network: string, indexerAddress: string, operatorAddress: string, number: number) {
        return prometheusFormatBalance(network, indexerAddress, operatorAddress, number)
    }

    formatAllocation(network: string, indexer: string, name: string, ipfsHash: string, number: number) {
        return prometheusFormatAllocation(network, indexer, name, ipfsHash, number)
    }

    formatConfig(name: string, network: string, value: number) {
        return prometheusFormatConfig(name, network, value)
    }

    formatEpoch(network: string, epoch: number): string {
        return prometheusFormatConfig("epoch", network, epoch)
    }
}