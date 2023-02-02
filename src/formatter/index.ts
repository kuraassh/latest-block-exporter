function prometheusFormat(name: string, blockchain: string, number: number) {
    return `#TYPE ${name} gauge\n${name}{blockchain="${blockchain}"} ${number}`
}

export class Formatter {
    formatLatest(blockchain: string, number: number) {
        return prometheusFormat("latest_block", blockchain, number)
    }

    formatCurrent(blockchain: string, number: number) {
        return prometheusFormat("current_block", blockchain, number)
    }
}