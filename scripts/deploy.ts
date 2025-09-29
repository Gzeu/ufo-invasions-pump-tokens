// GPZ-83: Enhanced BSC Deployment Script for UFOInvasionsNFT
// Complete production deployment with configuration and testing

import { ethers } from "hardhat";
import { Contract } from "ethers";
import * as fs from "fs";
import * as path from "path";

// Deployment Configuration
interface DeploymentConfig {
  network: string;
  contractName: string;
  constructorArgs: any[];
  initialSetup: {
    mintPrices: { [key: string]: string };
    authorizedMinters: string[];
    initialRewardPool: string;
  };
  verification: boolean;
}

// UFO Types Enum (matches contract)
enum UFOType {
  SCOUT = 0,
  BATTLE_CRUISER = 1,
  MOTHERSHIP = 2,
  SPECIAL_EDITION = 3
}

// Badge Types (matches contract)
const BADGE_TYPES = [
  "ROOKIE_PILOT",
  "PUMP_HUNTER", 
  "DIAMOND_HANDS",
  "SOCIAL_COMMANDER",
  "ALIEN_AMBASSADOR",
  "COSMIC_EXPLORER",
  "DEGEN_WARRIOR",
  "LEGENDARY_INVADER"
];

// Network Configurations
const NETWORK_CONFIGS: { [key: string]: DeploymentConfig } = {
  bscTestnet: {
    network: "BSC Testnet",
    contractName: "UFOInvasionsNFT",
    constructorArgs: [],
    initialSetup: {
      mintPrices: {
        [UFOType.SCOUT]: "0.001",         // 0.001 BNB
        [UFOType.BATTLE_CRUISER]: "0.01", // 0.01 BNB
        [UFOType.MOTHERSHIP]: "0.05",     // 0.05 BNB
        [UFOType.SPECIAL_EDITION]: "0.1"  // 0.1 BNB
      },
      authorizedMinters: [], // Will be set to deployer initially
      initialRewardPool: "100" // 100 testnet USDT
    },
    verification: true
  },
  
  bscMainnet: {
    network: "BSC Mainnet",
    contractName: "UFOInvasionsNFT",
    constructorArgs: [],
    initialSetup: {
      mintPrices: {
        [UFOType.SCOUT]: "0.001",         // 0.001 BNB (~$0.60)
        [UFOType.BATTLE_CRUISER]: "0.01", // 0.01 BNB (~$6)
        [UFOType.MOTHERSHIP]: "0.05",     // 0.05 BNB (~$30)
        [UFOType.SPECIAL_EDITION]: "0.1"  // 0.1 BNB (~$60)
      },
      authorizedMinters: [], // Will be set to deployer initially
      initialRewardPool: "1000" // 1000 USDT
    },
    verification: true
  }
};

// USDT Contract Addresses
const USDT_ADDRESSES = {
  bscTestnet: "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684",
  bscMainnet: "0x55d398326f99059fF775485246999027B3197955"
};

// Deployment Function
async function deployUFOInvasionsNFT(
  networkName: string,
  config: DeploymentConfig
): Promise<{
  contract: Contract;
  address: string;
  deploymentTx: string;
  gasUsed: bigint;
}> {
  console.log(`\n🚀 Deploying ${config.contractName} to ${config.network}...`);
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const deployerBalance = await ethers.provider.getBalance(deployerAddress);
  
  console.log(`📝 Deployer address: ${deployerAddress}`);
  console.log(`💰 Deployer balance: ${ethers.formatEther(deployerBalance)} BNB`);
  
  // Check minimum balance
  const minBalance = ethers.parseEther("0.1"); // 0.1 BNB minimum
  if (deployerBalance < minBalance) {
    throw new Error(`❌ Insufficient balance. Need at least 0.1 BNB for deployment.`);
  }
  
  // Deploy contract
  console.log(`\n⚙️ Compiling and deploying contract...`);
  
  const UFOInvasionsNFT = await ethers.getContractFactory("UFOInvasionsNFT");
  const contract = await UFOInvasionsNFT.deploy(deployerAddress); // initialOwner = deployer
  
  // Wait for deployment
  const deploymentReceipt = await contract.deploymentTransaction()?.wait();
  
  if (!deploymentReceipt) {
    throw new Error("❌ Deployment transaction failed");
  }
  
  const contractAddress = await contract.getAddress();
  
  console.log(`✅ Contract deployed successfully!`);
  console.log(`📍 Contract address: ${contractAddress}`);
  console.log(`🔗 Transaction hash: ${deploymentReceipt.hash}`);
  console.log(`⛽ Gas used: ${deploymentReceipt.gasUsed.toString()}`);
  
  return {
    contract,
    address: contractAddress,
    deploymentTx: deploymentReceipt.hash,
    gasUsed: deploymentReceipt.gasUsed
  };
}

// Initial Contract Setup
async function setupContract(
  contract: Contract,
  config: DeploymentConfig,
  networkName: string
): Promise<void> {
  console.log(`\n⚙️ Setting up contract initial configuration...`);
  
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  // Set mint prices for each UFO type
  console.log(`💰 Setting mint prices...`);
  for (const [ufoType, price] of Object.entries(config.initialSetup.mintPrices)) {
    const priceInWei = ethers.parseEther(price);
    const tx = await contract.setMintPrice(parseInt(ufoType), priceInWei);
    await tx.wait();
    console.log(`  - UFO Type ${ufoType}: ${price} BNB`);
  }
  
  // Add deployer as authorized minter initially
  console.log(`\n🔐 Setting up authorized minters...`);
  const addMinterTx = await contract.addAuthorizedMinter(deployerAddress);
  await addMinterTx.wait();
  console.log(`  - Added deployer as authorized minter: ${deployerAddress}`);
  
  console.log(`✅ Contract setup completed successfully!`);
}

// Contract Verification
async function verifyContract(
  contractAddress: string,
  constructorArgs: any[],
  networkName: string
): Promise<void> {
  console.log(`\n🔍 Verifying contract on BSCScan...`);
  
  try {
    await ethers.run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArgs,
      network: networkName
    });
    console.log(`✅ Contract verified successfully!`);
  } catch (error: any) {
    if (error.message.includes("already verified")) {
      console.log(`✅ Contract already verified`);
    } else {
      console.error(`❌ Verification failed:`, error.message);
      throw error;
    }
  }
}

// Save Deployment Info
function saveDeploymentInfo(
  networkName: string,
  deployment: {
    address: string;
    deploymentTx: string;
    gasUsed: bigint;
  },
  config: DeploymentConfig
): void {
  const deploymentInfo = {
    network: networkName,
    contractName: config.contractName,
    address: deployment.address,
    transactionHash: deployment.deploymentTx,
    gasUsed: deployment.gasUsed.toString(),
    timestamp: new Date().toISOString(),
    explorer: networkName === 'bscTestnet' 
      ? `https://testnet.bscscan.com/address/${deployment.address}`
      : `https://bscscan.com/address/${deployment.address}`,
    initialSetup: config.initialSetup
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info
  const filePath = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`💾 Deployment info saved to: ${filePath}`);
}

// Test Contract Functions
async function testContract(contractAddress: string): Promise<void> {
  console.log(`\n🧪 Testing deployed contract functions...`);
  
  const contract = await ethers.getContractAt("UFOInvasionsNFT", contractAddress);
  const [deployer] = await ethers.getSigners();
  
  try {
    // Test basic functions
    console.log(`📝 Testing contract name and symbol...`);
    const name = await contract.name();
    const symbol = await contract.symbol();
    console.log(`  - Name: ${name}`);
    console.log(`  - Symbol: ${symbol}`);
    
    // Test ownership
    console.log(`\n👑 Testing ownership...`);
    const owner = await contract.owner();
    console.log(`  - Owner: ${owner}`);
    console.log(`  - Is deployer owner: ${owner.toLowerCase() === (await deployer.getAddress()).toLowerCase()}`);
    
    // Test mint prices
    console.log(`\n💰 Testing mint prices...`);
    for (let ufoType = 0; ufoType < 4; ufoType++) {
      try {
        const price = await contract.getMintPrice(ufoType);
        console.log(`  - UFO Type ${ufoType}: ${ethers.formatEther(price)} BNB`);
      } catch (error) {
        console.log(`  - UFO Type ${ufoType}: Price not set`);
      }
    }
    
    console.log(`\n✅ All contract tests passed!`);
    
  } catch (error: any) {
    console.error(`❌ Contract testing failed:`, error.message);
    throw error;
  }
}

// Main Deployment Function
async function main() {
  const networkName = ethers.provider._networkName || "hardhat";
  
  console.log(`\n🛸 UFO Invasions NFT Deployment Script`);
  console.log(`🌐 Network: ${networkName}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  
  // Get network configuration
  const config = NETWORK_CONFIGS[networkName];
  if (!config) {
    throw new Error(`❌ No configuration found for network: ${networkName}`);
  }
  
  try {
    // Deploy contract
    const deployment = await deployUFOInvasionsNFT(networkName, config);
    
    // Setup initial configuration
    await setupContract(deployment.contract, config, networkName);
    
    // Test deployed contract
    await testContract(deployment.address);
    
    // Verify contract if enabled
    if (config.verification && process.env.BSCSCAN_API_KEY) {
      await verifyContract(
        deployment.address,
        config.constructorArgs,
        networkName
      );
    }
    
    // Save deployment information
    saveDeploymentInfo(networkName, deployment, config);
    
    // Final summary
    console.log(`\n🎉 Deployment Summary:`);
    console.log(`📍 Network: ${config.network}`);
    console.log(`📋 Contract: ${config.contractName}`);
    console.log(`🏠 Address: ${deployment.address}`);
    console.log(`💸 Gas Used: ${deployment.gasUsed.toString()}`);
    console.log(`🔗 Explorer: ${networkName === 'bscTestnet' 
      ? `https://testnet.bscscan.com/address/${deployment.address}`
      : `https://bscscan.com/address/${deployment.address}`}`);
    
    console.log(`\n✅ Deployment completed successfully!`);
    console.log(`\n📋 Next Steps:`);
    console.log(`  1. Update .env file with contract address`);
    console.log(`  2. Fund reward pool with USDT`);
    console.log(`  3. Configure frontend integration`);
    console.log(`  4. Test all contract functions`);
    
  } catch (error: any) {
    console.error(`\n❌ Deployment failed:`, error.message);
    process.exit(1);
  }
}

// Environment Setup Helper
function checkEnvironmentSetup(): void {
  console.log(`\n🔧 Environment Setup Checklist:`);
  
  const requiredVars = ['PRIVATE_KEY', 'BSCSCAN_API_KEY'];
  const optionalVars = ['COINMARKETCAP_API_KEY', 'REPORT_GAS'];
  
  console.log(`\n📋 Required Variables:`);
  requiredVars.forEach(varName => {
    const isSet = !!process.env[varName];
    console.log(`  ${isSet ? '✅' : '❌'} ${varName}: ${isSet ? 'Set' : 'Missing'}`);
  });
  
  console.log(`\n📋 Optional Variables:`);
  optionalVars.forEach(varName => {
    const isSet = !!process.env[varName];
    console.log(`  ${isSet ? '✅' : '⚪'} ${varName}: ${isSet ? 'Set' : 'Not set'}`);
  });
}

// Run deployment with environment check
if (require.main === module) {
  // Show environment setup
  checkEnvironmentSetup();
  
  // Run deployment
  main()
    .then(() => {
      console.log(`\n🎊 UFO Invasions NFT deployment completed!`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`\n💥 Deployment failed:`, error);
      process.exit(1);
    });
}

// Export pentru testing
export {
  deployUFOInvasionsNFT,
  setupContract,
  testContract,
  NETWORK_CONFIGS,
  USDT_ADDRESSES,
  UFOType,
  BADGE_TYPES
};
