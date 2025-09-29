'use client';

import { useContractWrite, useContractRead, useAccount, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { useGameStore } from '@/lib/store/gameStore';
import UFOInvasionsNFT from '../../contracts/artifacts/contracts/UFOInvasionsNFT.sol/UFOInvasionsNFT.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;

export function useNFTContract() {
  const { address } = useAccount();
  const { addNotification } = useGameStore();

  // 🆓 Mint Free Scout Ship
  const { 
    write: mintFreeScoutShip, 
    data: mintData, 
    isLoading: isMinting 
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: UFOInvasionsNFT.abi,
    functionName: 'mintFreeScoutShip',
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: '🛸 Scout Ship Minted!',
        message: 'Your free UFO Scout Ship has been minted successfully!'
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Minting Failed',
        message: error.message || 'Failed to mint Scout Ship'
      });
    }
  });

  // 💎 Mint Premium UFO
  const { 
    write: mintPremiumUFO, 
    data: premiumMintData, 
    isLoading: isMintingPremium 
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: UFOInvasionsNFT.abi,
    functionName: 'mintPremiumUFO',
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: '🚀 Premium UFO Minted!',
        message: 'Your premium UFO has been minted successfully!'
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Premium Minting Failed',
        message: error.message || 'Failed to mint premium UFO'
      });
    }
  });

  // 💰 Claim Rewards
  const { 
    write: claimRewards, 
    data: claimData, 
    isLoading: isClaiming 
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: UFOInvasionsNFT.abi,
    functionName: 'claimRewards',
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: '💰 Rewards Claimed!',
        message: 'Your rewards have been claimed successfully!'
      });
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Claim Failed',
        message: error.message || 'Failed to claim rewards'
      });
    }
  });

  // 📊 Read User NFTs
  const { data: userNFTs } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: UFOInvasionsNFT.abi,
    functionName: 'getUserNFTs',
    args: [address],
    enabled: !!address,
    watch: true
  });

  // 📈 Read User NFT Count
  const { data: nftBalance } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: UFOInvasionsNFT.abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
    watch: true
  });

  // 💎 Read Token Metadata
  const getTokenMetadata = (tokenId: number) => {
    return useContractRead({
      address: CONTRACT_ADDRESS,
      abi: UFOInvasionsNFT.abi,
      functionName: 'getTokenMetadata',
      args: [tokenId],
      enabled: !!tokenId
    });
  };

  // 💰 Calculate Daily Reward
  const calculateDailyReward = (tokenId: number) => {
    return useContractRead({
      address: CONTRACT_ADDRESS,
      abi: UFOInvasionsNFT.abi,
      functionName: 'calculateDailyReward',
      args: [tokenId],
      enabled: !!tokenId
    });
  };

  // 🎯 Add Mission Badge
  const { 
    write: addMissionBadge, 
    data: badgeData, 
    isLoading: isAddingBadge 
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: UFOInvasionsNFT.abi,
    functionName: 'addMissionBadge',
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: '🏆 Badge Earned!',
        message: 'New mission badge added to your UFO!'
      });
    }
  });

  // Transaction status tracking
  const { isLoading: isMintTxLoading } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess: () => {
      // Refresh user data after successful transaction
      window.location.reload();
    }
  });

  const { isLoading: isPremiumTxLoading } = useWaitForTransaction({
    hash: premiumMintData?.hash,
    onSuccess: () => {
      window.location.reload();
    }
  });

  const { isLoading: isClaimTxLoading } = useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess: () => {
      window.location.reload();
    }
  });

  // Helper functions
  const mintFreeUFO = () => {
    if (!address) {
      addNotification({
        type: 'error',
        title: 'Wallet Required',
        message: 'Please connect your wallet to mint a free UFO'
      });
      return;
    }

    mintFreeScoutShip({
      args: [address]
    });
  };

  const mintPremium = (shipType: number, price: string) => {
    if (!address) {
      addNotification({
        type: 'error',
        title: 'Wallet Required',
        message: 'Please connect your wallet to mint a premium UFO'
      });
      return;
    }

    mintPremiumUFO({
      args: [address, shipType],
      value: parseEther(price)
    });
  };

  const claimNFTRewards = (tokenId: number) => {
    if (!address) {
      addNotification({
        type: 'error',
        title: 'Wallet Required',
        message: 'Please connect your wallet to claim rewards'
      });
      return;
    }

    claimRewards({
      args: [tokenId]
    });
  };

  const addBadgeToNFT = (tokenId: number, badge: number) => {
    addMissionBadge({
      args: [tokenId, badge]
    });
  };

  return {
    // Contract reads
    userNFTs: userNFTs as number[] || [],
    nftBalance: Number(nftBalance) || 0,
    getTokenMetadata,
    calculateDailyReward,
    
    // Contract writes
    mintFreeUFO,
    mintPremium,
    claimNFTRewards,
    addBadgeToNFT,
    
    // Loading states
    isMinting: isMinting || isMintTxLoading,
    isMintingPremium: isMintingPremium || isPremiumTxLoading,
    isClaiming: isClaiming || isClaimTxLoading,
    isAddingBadge,
    
    // Contract address
    contractAddress: CONTRACT_ADDRESS
  };
}