
# CoreDev Zero - Blockchain Requirements Documentation

## Overview
CoreDev Zero is a decentralized lending platform that enables verified developers to create isolated loan markets backed by their reputation and project deliverables. This document outlines the smart contract requirements and blockchain infrastructure needed.

## Core Concept
- **Isolated Markets**: Each loan creates a separate market contract
- **Developer Reputation**: Soul-Bound Tokens (SBTs) track developer achievements
- **Project-Backed Loans**: Loans are secured by project deliverables stored on IPFS
- **Fixed-Rate Lending**: No variable rates, clear terms upfront
- **Community Governance**: Stakeholders participate in platform decisions

## Required Smart Contracts

### 1. MarketFactory.sol
**Purpose**: Main factory contract for creating loan markets

**Required Functions**:
```solidity
// Core Functions
function createMarket(
    uint256 loanAmount,
    uint256 interestRateBps,
    uint256 tenorSeconds,
    string calldata projectCID
) external returns (address marketAddress);

function grantDeveloperRole(address developer) external;
function revokeDeveloperRole(address developer) external;

// View Functions
function isDeveloper(address user) external view returns (bool);
function getAllMarkets() external view returns (address[] memory);
function getMarketsByBorrower(address borrower) external view returns (address[] memory);
function totalMarkets() external view returns (uint256);
function platformFee() external view returns (uint256);

// Admin Functions
function setPlatformFee(uint256 newFeeBps) external;
function pause() external;
function unpause() external;
```

**Required Events**:
```solidity
event MarketCreated(address indexed borrower, address indexed marketAddress, string projectCID);
event DeveloperRoleGranted(address indexed user);
event DeveloperRoleRevoked(address indexed user);
event PlatformFeeUpdated(uint256 newFeeBps);
```

**Access Control**:
- DEFAULT_ADMIN_ROLE: Platform admin
- DEVELOPER_ROLE: Verified developers who can create markets
- PAUSER_ROLE: Can pause/unpause platform

### 2. LoanMarket.sol
**Purpose**: Individual loan market contract (created by factory)

**Required Functions**:
```solidity
// Lending Functions
function deposit() external payable;
function withdraw(uint256 amount) external;
function startLoan() external;
function repayLoan() external payable;

// View Functions
function borrower() external view returns (address);
function loanAmount() external view returns (uint256);
function interestRateBps() external view returns (uint256);
function tenorSeconds() external view returns (uint256);
function projectCID() external view returns (string memory);
function totalDeposited() external view returns (uint256);
function currentState() external view returns (uint8); // 0=Funding, 1=Active, 2=Repaid, 3=Defaulted
function lenderDeposits(address lender) external view returns (uint256);
function startTime() external view returns (uint256);
function dueDate() external view returns (uint256);

// Emergency Functions
function emergencyWithdraw() external; // If funding fails
function liquidate() external; // If loan defaults
```

**Required Events**:
```solidity
event Deposited(address indexed lender, uint256 amount);
event Withdrawn(address indexed lender, uint256 amount);
event LoanStarted(uint256 startTime, uint256 fundingAmount);
event LoanRepaid(uint256 totalAmount);
event LoanDefaulted();
```

**State Machine**:
- FUNDING: Accepting deposits
- ACTIVE: Loan started, borrower has funds
- REPAID: Successfully repaid
- DEFAULTED: Past due date

### 3. ReputationSBT.sol
**Purpose**: Soul-Bound Tokens for developer achievements

**Required Functions**:
```solidity
// Minting Functions
function mintAchievement(address to, string calldata tokenURI) external returns (uint256);
function batchMintAchievements(address[] calldata to, string[] calldata tokenURIs) external;

// View Functions
function tokenURI(uint256 tokenId) external view returns (string memory);
function balanceOf(address owner) external view returns (uint256);
function ownerOf(uint256 tokenId) external view returns (address);
function getUserTokens(address user) external view returns (uint256[] memory);

// Achievement Categories
function getAchievementsByCategory(address user, string calldata category) external view returns (uint256[] memory);
```

**Required Events**:
```solidity
event AchievementMinted(address indexed to, uint256 indexed tokenId, string category);
```

**Non-Transferable**: SBTs cannot be transferred (except burning)

### 4. StakingVault.sol
**Purpose**: Platform token staking for governance and rewards

**Required Functions**:
```solidity
// Staking Functions
function stake(uint256 amount) external;
function unstake(uint256 amount) external;
function claimRewards() external;

// Governance Functions
function vote(uint256 proposalId, bool support) external;
function createProposal(string calldata description, bytes calldata data) external;

// View Functions
function stakedBalance(address user) external view returns (uint256);
function pendingRewards(address user) external view returns (uint256);
function totalStaked() external view returns (uint256);
function votingPower(address user) external view returns (uint256);
```

**Required Events**:
```solidity
event Staked(address indexed user, uint256 amount);
event Unstaked(address indexed user, uint256 amount);
event RewardsClaimed(address indexed user, uint256 amount);
```

### 5. LoanPositionNFT.sol
**Purpose**: NFTs representing lender positions (tradeable)

**Required Functions**:
```solidity
// Minting Functions
function mintPosition(address lender, address market, uint256 amount) external returns (uint256);
function burnPosition(uint256 tokenId) external;

// View Functions
function getPositionData(uint256 tokenId) external view returns (address market, uint256 amount, uint256 mintTime);
function getUserPositions(address user) external view returns (uint256[] memory);
```

## Gas Optimization Requirements

### Priority Optimizations
1. **Batch Operations**: Support batch deposits/withdrawals
2. **Efficient Storage**: Pack structs to minimize storage slots
3. **Event Indexing**: Proper event indexing for efficient querying
4. **View Functions**: Use view/pure functions where possible

### Estimated Gas Costs
- Create Market: ~200k gas
- Deposit: ~50k gas
- Withdraw: ~60k gas
- Start Loan: ~80k gas
- Repay Loan: ~100k gas

## Security Requirements

### Access Control
- Role-based permissions using OpenZeppelin AccessControl
- Multi-signature admin controls for critical functions
- Time-locked upgrades for contract changes

### Reentrancy Protection
- Use OpenZeppelin ReentrancyGuard
- Checks-Effects-Interactions pattern
- State changes before external calls

### Oracle Integration
- Chainlink price feeds for USD conversion
- Time-based oracle for interest calculations
- Backup oracle mechanisms

## Event Architecture for Real-Time Updates

### Market Events
```solidity
// Factory Level
MarketCreated(borrower, marketAddress, projectCID)
DeveloperRoleGranted(user)
PlatformPaused()

// Market Level  
Deposited(lender, amount)
LoanStarted(startTime, fundingAmount)
LoanRepaid(totalAmount)
LoanDefaulted()
```

### Frontend Integration
- WebSocket connection to blockchain node
- Event filtering by user address
- Real-time balance updates
- Notification system integration

## IPFS Integration Requirements

### Project Data Structure
```json
{
  "title": "Project Name",
  "description": "Detailed description",
  "repository": "github.com/user/repo",
  "tags": ["DeFi", "React", "Smart Contracts"],
  "milestones": [
    {
      "title": "MVP Development", 
      "description": "Basic functionality",
      "dueDate": "2024-03-01",
      "deliverables": ["Smart contracts", "Frontend"]
    }
  ],
  "techStack": ["Solidity", "React", "Node.js"],
  "fundingPurpose": "Development and deployment costs"
}
```

### Metadata Standards
- Follow ERC-721 metadata standard for NFTs
- IPFS hash validation
- Pin important project data
- Backup strategies for critical data

## Testing Requirements

### Unit Tests Coverage
- 95%+ code coverage for all contracts
- Edge case testing for state transitions
- Gas usage optimization tests
- Access control validation

### Integration Tests
- Full user journey testing
- Cross-contract interaction tests
- Event emission validation
- Frontend integration tests

### Mainnet Deployment Checklist
- [ ] Security audit completed
- [ ] Gas optimization verified
- [ ] Oracle integration tested
- [ ] Emergency procedures documented
- [ ] Multi-sig setup configured
- [ ] Monitoring systems active

## Performance Metrics

### Transaction Throughput
- Target: 1000+ transactions per day
- Average confirmation time: 2-3 blocks
- Failed transaction rate: <1%

### User Experience Metrics
- Wallet connection: <3 seconds
- Transaction signing: <5 seconds
- Data loading: <2 seconds
- Real-time updates: <1 second delay

## Monitoring and Analytics

### On-Chain Metrics
- Total Value Locked (TVL)
- Number of active markets
- Default rates by developer tier
- Platform fee collection

### Off-Chain Metrics
- User engagement analytics
- Project success correlation
- Geographic usage patterns
- Performance bottlenecks

## Future Enhancements

### Phase 2 Features
- Cross-chain lending markets
- Automated liquidation system
- Machine learning risk assessment
- Mobile application support

### Scalability Solutions
- Layer 2 integration (Arbitrum/Optimism)
- State channel implementation
- Batch transaction processing
- Off-chain computation with on-chain verification

---

**Contact Information**
- Technical Lead: [Email]
- Smart Contract Developer: [Email]  
- Security Auditor: [Email]
- Project Manager: [Email]

**Timeline**
- Contract Development: 6-8 weeks
- Testing & Audit: 4-6 weeks
- Deployment & Integration: 2-3 weeks
- **Total Estimated Timeline: 12-17 weeks**

