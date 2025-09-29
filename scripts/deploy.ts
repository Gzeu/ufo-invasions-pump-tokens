import { ethers } from 'hardhat';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('🛸 Deploying UFO Invasions NFT Contract...');
  
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  // Deploy UFOInvasionsNFT
  const UFOInvasionsNFT = await ethers.getContractFactory('UFOInvasionsNFT');
  const nftContract = await UFOInvasionsNFT.deploy(
    'UFO Invasions',
    'UFO',
    deployer.address
  );

  await nftContract.deployed();
  console.log('✅ UFOInvasionsNFT deployed to:', nftContract.address);

  // Add deployer as authorized minter
  console.log('⚙️ Setting up authorized minter...');
  await nftContract.addAuthorizedMinter(deployer.address);
  console.log('✅ Deployer added as authorized minter');

  // Add initial funds to reward pool (0.1 BNB)
  console.log('💰 Adding initial funds to reward pool...');
  const initialFunding = ethers.utils.parseEther('0.1');
  await nftContract.addToRewardPool({ value: initialFunding });
  console.log('✅ Added 0.1 BNB to reward pool');

  // Set mint prices
  console.log('💎 Setting mint prices...');
  await nftContract.setMintPrice(1, ethers.utils.parseEther('0.01')); // Battle Cruiser
  await nftContract.setMintPrice(2, ethers.utils.parseEther('0.05')); // Mothership
  await nftContract.setMintPrice(3, ethers.utils.parseEther('0.1'));  // Special Edition
  console.log('✅ Mint prices configured');

  // Save deployment info
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    contract: {
      name: 'UFOInvasionsNFT',
      address: nftContract.address,
      deployer: deployer.address,
      deployedAt: new Date().toISOString(),
      transactionHash: nftContract.deployTransaction.hash,
      gasUsed: (await nftContract.deployTransaction.wait()).gasUsed.toString(),
      blockNumber: (await nftContract.deployTransaction.wait()).blockNumber
    },
    configuration: {
      initialRewardPool: '0.1 BNB',
      mintPrices: {
        scoutShip: 'Free',
        battleCruiser: '0.01 BNB',
        mothership: '0.05 BNB',
        specialEdition: '0.1 BNB'
      }
    }
  };

  // Write deployment info to file
  const deploymentPath = join(__dirname, '..', 'deployments', `deployment-${Date.now()}.json`);
  writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('📄 Deployment info saved to:', deploymentPath);

  // Generate .env variables
  console.log('\n🔧 Environment Variables:');
  console.log(`NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${nftContract.address}`);
  console.log(`CONTRACT_DEPLOYER_ADDRESS=${deployer.address}`);
  
  // Verify contract (if on testnet/mainnet)
  const networkName = (await ethers.provider.getNetwork()).name;
  if (networkName !== 'hardhat' && networkName !== 'localhost') {
    console.log('\n🔍 Contract verification:');
    console.log(`npx hardhat verify --network ${networkName} ${nftContract.address} "UFO Invasions" "UFO" ${deployer.address}`);
  }

  console.log('\n🎉 Deployment completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });