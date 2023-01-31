import express from 'express'

import axios from "axios";

const app = express()

type CeloReponse = {
    data: {
        latestBlock: number
    }
}

type OptimismResponse = {
    result: string
}

type ArbitrumResponse = {
    result: string
}

function prometheusFormat(name: string, blockchain: string, number: number) {
    return `#TYPE ${name} gauge\n${name}{blockchain="${blockchain}"} ${number}`
}

function formatCeloResponse(response: CeloReponse) {
    const latestBlock = response.data.latestBlock
    return prometheusFormat("latest_block", "celo", latestBlock)
}

function formatArbitrumResponse(response: ArbitrumResponse) {
    const latestBlockStr = response.result

    // Parse hex string to number
    const latestBlock = parseInt(latestBlockStr, 16)
    return prometheusFormat("latest_block", "arbitrum", latestBlock)
}

function formatOptimismResponse(response: OptimismResponse) {
    const latestBlockStr = response.result

    // Parse hex string to number
    const latestBlock = parseInt(latestBlockStr, 16)
    return prometheusFormat("latest_block", "optimism", latestBlock)
}

app.get('/celo', async (req, res) => {
    const url = "https://explorer.celo.org/mainnet/graphiql"
    const body = {"query": "query{latestBlock}", "variables": {}}

    // Send POST request with body
    const response = await axios.post(url, body)

    // Get response
    const data = response.data as CeloReponse

    // Format response
    const formattedResponse = formatCeloResponse(data)

    // Send response
    res.send(formattedResponse)
})

app.get('/optimism', async (req, res) => {
    const url = "https://api-optimistic.etherscan.io/api?module=proxy&action=eth_blockNumber"
    
    // Send GET request
    const response = await axios.get(url)

    // Get response
    const data = response.data as OptimismResponse

    // Format response
    const formattedResponse = formatOptimismResponse(data)

    // Send response
    res.send(formattedResponse)
})

app.get('/arbitrum', async (req, res) => {
    const url = "https://arbitrum.public-rpc.com"
    const body = {"jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 1}
    
    // Send POSt request
    const response = await axios.post(url, body)

    // Get response
    const data = response.data as ArbitrumResponse

    // Format response
    const formattedResponse = formatArbitrumResponse(data)

    // Send response
    res.send(formattedResponse)
})



app.listen(8081)