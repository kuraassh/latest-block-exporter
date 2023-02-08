export type AllocationInfo = {
    name: string
    ipfsHash: string
    creationTime: number
}

export type OperatorInfo = {
    id: string
}

export type GraphQLResponse<T> = {
    data: T
}

export type AllocationResponseElement = {
    createdAtEpoch: number
    subgraphDeployment: {
        ipfsHash: string
        originalName: string
    }
}

export type AllocationResponse = {
    allocations: AllocationResponseElement[]
}

export type OperatorsResponseElement = {
    id: string
}

export type IndexerResponseElement = {
    account: {
        operators: OperatorsResponseElement[]
    }
}

export type OperatorsResponse = {
    indexers: IndexerResponseElement[]
}

export type BlockResponse = {
    epoches: {
        id: string
    }[]
}