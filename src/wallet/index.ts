import Web3 from 'web3';

export class ConcreteNetworkWalletFetcher {
  private web3: Web3;

  constructor(rpc: string) {
    this.web3 = new Web3(rpc);
  }

  public async getBalance(address: string): Promise<number | null> {
    try {
      const weiBalance = await this.web3.eth.getBalance(address);
      const balance = this.web3.utils.fromWei(weiBalance, 'ether');

      return Number(balance);
    } catch (e) {
      return null;
    }
  }
}

export class WalletFetcher {
  private ethMainnetFetcher: ConcreteNetworkWalletFetcher;
  private ethGoerliFetcher: ConcreteNetworkWalletFetcher;

  constructor() {
    this.ethMainnetFetcher = new ConcreteNetworkWalletFetcher('https://eth.rpc.blxrbdn.com');
    this.ethGoerliFetcher = new ConcreteNetworkWalletFetcher('https://eth-goerli.public.blastapi.io');
  }

  private getFetcher(network: Network): ConcreteNetworkWalletFetcher {
    switch (network) {
      case 'eth-mainnet':
        return this.ethMainnetFetcher;
      case 'eth-goerli':
        return this.ethGoerliFetcher;
      default:
        throw new Error('Invalid network');
    }
  }

  public async getBalance(network: Network, address: string): Promise<number | null> {
    const fetcher = this.getFetcher(network);
    return fetcher.getBalance(address);
  }
}