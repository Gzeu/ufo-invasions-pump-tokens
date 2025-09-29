'use client';

import { useEffect } from 'react';
import { useAccount, useNetwork, useBalance } from 'wagmi';
import { useGameStore } from '@/lib/store/gameStore';
import { useNFTContract } from './useNFTContract';

export function useWeb3Integration() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useBalance({ address });
  
  const {
    setUserAddress,
    setConnected,
    updateUserStats,
    loadMissions,
    loadRewards,
    loadLeaderboard,
    leaderboardTimeframe,
    addNotification
  } = useGameStore();
  
  const { userNFTs, nftBalance } = useNFTContract();

  // Update store when wallet connection changes
  useEffect(() => {
    setUserAddress(address || null);
    setConnected(isConnected);

    if (isConnected && address) {
      // Load user data when connected
      loadUserData();
    }
  }, [address, isConnected]);

  // Update NFT count when contract data changes
  useEffect(() => {
    if (nftBalance > 0) {
      updateUserStats({ nftCount: nftBalance });
    }
  }, [nftBalance]);

  // Check if user is on correct network
  useEffect(() => {
    if (isConnected && chain) {
      const supportedChains = [56, 97]; // BSC Mainnet, BSC Testnet
      
      if (!supportedChains.includes(chain.id)) {
        addNotification({
          type: 'warning',
          title: 'Wrong Network',
          message: 'Please switch to BSC network to use UFO Invasions'
        });
      }
    }
  }, [chain, isConnected]);

  const loadUserData = async () => {
    if (!address) return;

    try {
      // Load user profile from API
      const profileResponse = await fetch(`/api/user/profile?address=${address}`);
      const profileData = await profileResponse.json();
      
      if (profileData.success) {
        updateUserStats(profileData.profile);
      }

      // Load missions, rewards, and leaderboard
      await Promise.all([
        loadMissions(address),
        loadRewards(address),
        loadLeaderboard(leaderboardTimeframe, address)
      ]);

    } catch (error) {
      console.error('Failed to load user data:', error);
      addNotification({
        type: 'error',
        title: 'Loading Failed',
        message: 'Failed to load your profile data'
      });
    }
  };

  const refreshUserData = () => {
    if (address) {
      loadUserData();
    }
  };

  const switchToSupportedNetwork = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }], // BSC Mainnet
        });
      } catch (error) {
        console.error('Failed to switch network:', error);
        addNotification({
          type: 'error',
          title: 'Network Switch Failed',
          message: 'Failed to switch to BSC network'
        });
      }
    }
  };

  return {
    // Wallet info
    address,
    isConnected,
    balance: balance?.formatted || '0',
    balanceSymbol: balance?.symbol || 'BNB',
    chain,
    
    // NFT info
    userNFTs,
    nftBalance,
    
    // Actions
    refreshUserData,
    switchToSupportedNetwork,
    
    // Helpers
    isCorrectNetwork: chain?.id === 56 || chain?.id === 97,
    isBSCMainnet: chain?.id === 56,
    isBSCTestnet: chain?.id === 97
  };
}