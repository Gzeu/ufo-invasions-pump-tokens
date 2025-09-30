import { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';

// Smart contract deployment script for UFO Invasions
async function main() {
  console.log('🛸 UFO Invasions Smart Contract Deployment Starting...');
  
  // Get the network
  const network = await ethers.provider.getNetwork();
  console.log(`🌐 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);
  
  console.log(`🔑 Deployer: ${deployerAddress}`);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} BNB`);
  
  // Check minimum balance for deployment
  const minBalance = ethers.parseEther('0.01'); // 0.01 BNB minimum
  if (balance < minBalance) {
    throw new Error(`❌ Insufficient balance. Need at least 0.01 BNB, have ${ethers.formatEther(balance)} BNB`);
  }

  try {
    // Deploy UFOInvasionsNFT contract
    console.log('🛠️ Deploying UFOInvasionsNFT contract...');
    
    const UFOInvasionsNFT = await ethers.getContractFactory('UFOInvasionsNFT');
    
    // Constructor parameters
    const initialOwner = deployerAddress;
    const name = 'UFO Invasions Badges';
    const symbol = 'UFOBADGE';
    const baseURI = 'https://ufo-invasions-pump-tokens.vercel.app/api/metadata/';
    
    // Estimate gas for deployment
    const deploymentData = UFOInvasionsNFT.interface.encodeDeploy([initialOwner, name, symbol, baseURI]);
    const gasEstimate = await ethers.provider.estimateGas({
      data: deploymentData
    });
    
    console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);
    
    // Get current gas price
    const feeData = await ethers.provider.getFeeData();
    console.log(`⛽ Gas price: ${ethers.formatUnits(feeData.gasPrice || 0, 'gwei')} gwei`);
    
    // Deploy with optimized gas settings
    const contract = await UFOInvasionsNFT.deploy(
      initialOwner,
      name,
      symbol,
      baseURI,
      {
        gasLimit: gasEstimate * 120n / 100n, // Add 20% buffer
        gasPrice: feeData.gasPrice
      }
    );
    
    console.log('🔄 Transaction sent, waiting for confirmation...');
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    console.log(`✅ UFOInvasionsNFT deployed to: ${contractAddress}`);
    
    // Verify deployment
    console.log('🔍 Verifying deployment...');
    const deployedCode = await ethers.provider.getCode(contractAddress);
    if (deployedCode === '0x') {
      throw new Error('❌ Contract deployment failed - no code at address');
    }
    
    // Test basic contract functionality
    console.log('🧪 Testing contract functionality...');
    const owner = await contract.owner();
    const contractName = await contract.name();
    const contractSymbol = await contract.symbol();
    
    console.log(`🔑 Contract owner: ${owner}`);
    console.log(`🏷️ Name: ${contractName}`);
    console.log(`🎫 Symbol: ${contractSymbol}`);
    
    // Verify owner is correct
    if (owner.toLowerCase() !== deployerAddress.toLowerCase()) {
      console.warn('⚠️ Warning: Contract owner does not match deployer');
    }
    
    // Save deployment information
    const deploymentInfo = {
      contractAddress,
      deployerAddress,
      network: network.name,
      chainId: network.chainId.toString(),
      blockNumber: await ethers.provider.getBlockNumber(),
      timestamp: new Date().toISOString(),
      transactionHash: contract.deploymentTransaction()?.hash,
      gasUsed: (await contract.deploymentTransaction()?.wait())?.gasUsed?.toString(),
      gasPrice: feeData.gasPrice?.toString(),
      constructorArgs: {
        initialOwner,
        name,
        symbol,
        baseURI
      }
    };
    
    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(process.cwd(), 'deployments', network.name);
    fs.mkdirSync(deploymentsDir, { recursive: true });
    
    // Save deployment info
    const deploymentPath = path.join(deploymentsDir, 'UFOInvasionsNFT.json');
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    
    console.log(`💾 Deployment info saved to: ${deploymentPath}`);
    
    // Update environment variables template
    const envTemplate = `
# UFO Invasions Smart Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}
NEXT_PUBLIC_CHAIN_ID=${network.chainId}
NEXT_PUBLIC_NETWORK_NAME=${network.name}
`;
    
    const envPath = path.join(process.cwd(), '.env.deployment');
    fs.writeFileSync(envPath, envTemplate);
    
    console.log(`🔗 Environment template saved to: ${envPath}`);
    
    // Output deployment summary
    console.log('\n🎆 DEPLOYMENT SUMMARY');
    console.log('='.repeat(50));
    console.log(`🛸 Contract: UFOInvasionsNFT`);
    console.log(`📍 Address: ${contractAddress}`);
    console.log(`🌐 Network: ${network.name} (${network.chainId})`);
    console.log(`💰 Gas Used: ${deploymentInfo.gasUsed}`);
    console.log(`🏁 Block: ${deploymentInfo.blockNumber}`);
    console.log(`✅ Status: Successfully deployed!`);
    console.log('='.repeat(50));
    
    // Set environment variable for GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::set-output name=contract_address::${contractAddress}`);
      console.log(`::set-output name=deployment_success::true`);
    }
    
    return {
      contractAddress,
      deploymentInfo,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    
    // Set failure output for GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::set-output name=deployment_success::false`);
      console.log(`::set-output name=error::${(error as Error).message}`);
    }
    
    throw error;
  }
}

// Error handling and script execution
if (require.main === module) {
  main()
    .then((result) => {
      console.log('🚀 Deployment completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal deployment error:', error);
      process.exit(1);
    });
}

export default main;