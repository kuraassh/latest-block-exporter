function prometheusFormatBlock(name: string, blockchain: string, number: number) {
    return `#TYPE ${name} gauge\n${name}{blockchain="${blockchain}"} ${number}`
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

    formatCurrent(blockchain: string, number: number) {
        return prometheusFormatBlock("current_block", blockchain, number)
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