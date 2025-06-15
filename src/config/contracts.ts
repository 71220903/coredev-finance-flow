
export const CORE_TESTNET_CONFIG = {
  chainId: 1115,
  chainName: 'Core Blockchain Testnet',
  rpcUrl: 'https://rpc.test2.btcs.network',
  blockExplorer: 'https://scan.test2.btcs.network',
  nativeCurrency: {
    name: 'tCORE2',
    symbol: 'tCORE2',
    decimals: 18,
  },
  // Add admin address - replace with actual contract owner address
  adminAddress: '0x1234567890123456789012345678901234567890', // Replace with actual admin address
  contracts: {
    marketFactory: '0xYourMarketFactoryAddress', // Replace with actual address
    // Add other contract addresses as needed
  }
};
