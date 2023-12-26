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
  private arbMainnetFetcher: ConcreteNetworkWalletFetcher;

  constructor() {
    this.ethMainnetFetcher = new ConcreteNetworkWalletFetcher('https://eth.rpc.blxrbdn.com');
    this.arbMainnetFetcher = new ConcreteNetworkWalletFetcher('https://arbitrum-one.public.blastapi.io');
  }

  private getFetcher(network: Network): ConcreteNetworkWalletFetcher {
    switch (network) {
      case 'eth-mainnet':
        return this.ethMainnetFetcher;
      case 'eth-arbitrum':
        return this.arbMainnetFetcher;
      default:
        throw new Error('Invalid network');
    }
  }

  public async getBalance(network: Network, address: string): Promise<number | null> {
    const fetcher = this.getFetcher(network);
    return fetcher.getBalance(address);
  }
}