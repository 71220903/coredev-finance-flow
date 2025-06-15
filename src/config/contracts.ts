
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

// Contract addresses
export const CONTRACTS = {
  MARKET_FACTORY: '0xYourMarketFactoryAddress', // Replace with actual address
  STAKING_VAULT: '0xYourStakingVaultAddress', // Replace with actual address
  REPUTATION_SBT: '0xYourReputationSBTAddress', // Replace with actual address
  TESTNET_SUSDT: '0xYourTestnetSUSDTAddress', // Replace with actual address
};

// Contract ABIs - These are simplified ABIs, replace with actual contract ABIs
export const MARKET_FACTORY_ABI = [
  "function createMarket(string memory projectCID, uint256 fundingGoal, uint256 interestRate, uint256 duration) external returns (address)",
  "function profileOf(address user) external view returns (address)",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function DEVELOPER_ROLE() external view returns (bytes32)",
  "function createProfile(string memory githubHandle, string memory profileDataCID) external",
  "event MarketCreated(address indexed borrower, address indexed marketAddress, string projectCID)"
];

export const STAKING_VAULT_ABI = [
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function getStakedAmount(address user) external view returns (uint256)",
  "function getRewards(address user) external view returns (uint256)",
  "function claimRewards() external"
];

export const MARKET_ABI = [
  "function deposit(uint256 amount) external",
  "function repayLoan() external payable",
  "function claimFunds() external",
  "function getMarketInfo() external view returns (uint256, uint256, uint256, uint256, address, bool, bool)",
  "event Deposited(address indexed lender, uint256 amount)",
  "event LoanStarted(uint256 startTime, uint256 fundingAmount)",
  "event LoanRepaid(uint256 totalAmount)"
];

export const SUSDT_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

export const REPUTATION_SBT_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function mintAchievement(address to, string memory tokenURI) external",
  "function ownerOf(uint256 tokenId) external view returns (address)"
];
