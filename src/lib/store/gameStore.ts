import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Mission {
  id: string;
  type: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  rewards: {
    usdt: number;
    nft: boolean;
    badge?: string;
  };
  timeLimit: number;
  progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
}

interface Reward {
  id: string;
  type: 'MISSION' | 'DAILY' | 'STREAK' | 'BONUS' | 'NFT_REWARD';
  title: string;
  amount: number;
  currency: 'USDT' | 'BNB' | 'ETH';
  status: 'PENDING' | 'CLAIMABLE' | 'CLAIMED';
  unlocksAt?: number;
  description: string;
}

interface UserStats {
  totalRewards: number;
  nftCount: number;
  missionsCompleted: number;
  currentRank: number;
  powerLevel: number;
  badges: string[];
  experiencePoints: number;
}

interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  totalRewards: number;
  missionsCompleted: number;
  powerLevel: number;
  badges: string[];
  nftCount: number;
  isCurrentUser?: boolean;
}

interface GameState {
  // User Data
  userAddress: string | null;
  userStats: UserStats;
  isConnected: boolean;
  isLoading: boolean;
  
  // Missions
  activeMissions: Mission[];
  missionHistory: Mission[];
  loadingMissions: boolean;
  
  // Rewards
  availableRewards: Reward[];
  totalClaimable: number;
  claimingRewards: string[];
  
  // Leaderboard
  leaderboard: LeaderboardEntry[];
  leaderboardTimeframe: 'daily' | 'weekly' | 'monthly' | 'alltime';
  
  // UI State
  selectedTab: 'missions' | 'leaderboard' | 'rewards' | 'fleet';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: number;
  }>;
}

interface GameActions {
  // User Actions
  setUserAddress: (address: string | null) => void;
  setConnected: (connected: boolean) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  
  // Mission Actions
  setMissions: (missions: Mission[]) => void;
  updateMissionProgress: (missionId: string, progress: number) => void;
  completeMission: (missionId: string) => void;
  loadMissions: (userAddress: string) => Promise<void>;
  
  // Reward Actions
  setRewards: (rewards: Reward[]) => void;
  claimReward: (rewardId: string) => Promise<void>;
  claimAllRewards: () => Promise<void>;
  loadRewards: (userAddress: string) => Promise<void>;
  
  // Leaderboard Actions
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  setLeaderboardTimeframe: (timeframe: 'daily' | 'weekly' | 'monthly' | 'alltime') => void;
  loadLeaderboard: (timeframe: string, userAddress?: string) => Promise<void>;
  
  // UI Actions
  setSelectedTab: (tab: 'missions' | 'leaderboard' | 'rewards' | 'fleet') => void;
  addNotification: (notification: Omit<GameState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(  
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        userAddress: null,
        userStats: {
          totalRewards: 0,
          nftCount: 0,
          missionsCompleted: 0,
          currentRank: 0,
          powerLevel: 1,
          badges: [],
          experiencePoints: 0
        },
        isConnected: false,
        isLoading: false,
        
        activeMissions: [],
        missionHistory: [],
        loadingMissions: false,
        
        availableRewards: [],
        totalClaimable: 0,
        claimingRewards: [],
        
        leaderboard: [],
        leaderboardTimeframe: 'weekly',
        
        selectedTab: 'missions',
        notifications: [],
        
        // User Actions
        setUserAddress: (address) => set((state) => {
          state.userAddress = address;
        }),
        
        setConnected: (connected) => set((state) => {
          state.isConnected = connected;
          if (!connected) {
            state.userAddress = null;
            state.activeMissions = [];
            state.availableRewards = [];
          }
        }),
        
        updateUserStats: (stats) => set((state) => {
          state.userStats = { ...state.userStats, ...stats };
        }),
        
        // Mission Actions
        setMissions: (missions) => set((state) => {
          state.activeMissions = missions;
        }),
        
        updateMissionProgress: (missionId, progress) => set((state) => {
          const mission = state.activeMissions.find(m => m.id === missionId);
          if (mission) {
            mission.progress = progress;
          }
        }),
        
        completeMission: (missionId) => set((state) => {
          const missionIndex = state.activeMissions.findIndex(m => m.id === missionId);
          if (missionIndex !== -1) {
            const mission = state.activeMissions[missionIndex];
            mission.status = 'COMPLETED';
            mission.progress = 100;
            
            // Move to history
            state.missionHistory.push(mission);
            state.activeMissions.splice(missionIndex, 1);
            
            // Update stats
            state.userStats.missionsCompleted += 1;
            state.userStats.experiencePoints += 100;
            
            // Level up check
            const requiredXP = state.userStats.powerLevel * 500;
            if (state.userStats.experiencePoints >= requiredXP) {
              state.userStats.powerLevel += 1;
            }
          }
        }),
        
        loadMissions: async (userAddress) => {
          set((state) => { state.loadingMissions = true; });
          
          try {
            const response = await fetch(`/api/missions?address=${userAddress}`);
            const data = await response.json();
            
            if (data.success) {
              set((state) => {
                state.activeMissions = data.missions;
                state.loadingMissions = false;
              });
            }
          } catch (error) {
            console.error('Failed to load missions:', error);
            get().addNotification({
              type: 'error',
              title: 'Mission Load Failed',
              message: 'Failed to load your active missions'
            });
            
            set((state) => { state.loadingMissions = false; });
          }
        },
        
        // Reward Actions
        setRewards: (rewards) => set((state) => {
          state.availableRewards = rewards;
          state.totalClaimable = rewards
            .filter(r => r.status === 'CLAIMABLE')
            .reduce((sum, r) => sum + r.amount, 0);
        }),
        
        claimReward: async (rewardId) => {
          set((state) => {
            state.claimingRewards.push(rewardId);
          });
          
          try {
            const response = await fetch('/api/rewards/claim', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userAddress: get().userAddress,
                rewardIds: [rewardId]
              })
            });
            
            const data = await response.json();
            
            if (data.success) {
              set((state) => {
                const reward = state.availableRewards.find(r => r.id === rewardId);
                if (reward) {
                  reward.status = 'CLAIMED';
                  state.totalClaimable -= reward.amount;
                  state.userStats.totalRewards += reward.amount;
                }
                state.claimingRewards = state.claimingRewards.filter(id => id !== rewardId);
              });
              
              get().addNotification({
                type: 'success',
                title: 'Reward Claimed!',
                message: `Successfully claimed ${data.claimedAmount} USDT`
              });
            }
          } catch (error) {
            console.error('Failed to claim reward:', error);
            get().addNotification({
              type: 'error',
              title: 'Claim Failed',
              message: 'Failed to claim reward'
            });
            
            set((state) => {
              state.claimingRewards = state.claimingRewards.filter(id => id !== rewardId);
            });
          }
        },
        
        claimAllRewards: async () => {
          const claimableRewards = get().availableRewards.filter(r => r.status === 'CLAIMABLE');
          const rewardIds = claimableRewards.map(r => r.id);
          
          set((state) => {
            state.claimingRewards.push('all');
          });
          
          try {
            const response = await fetch('/api/rewards/claim', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userAddress: get().userAddress,
                rewardIds
              })
            });
            
            const data = await response.json();
            
            if (data.success) {
              set((state) => {
                state.availableRewards.forEach(reward => {
                  if (rewardIds.includes(reward.id)) {
                    reward.status = 'CLAIMED';
                  }
                });
                state.userStats.totalRewards += data.claimedAmount;
                state.totalClaimable = 0;
                state.claimingRewards = state.claimingRewards.filter(id => id !== 'all');
              });
              
              get().addNotification({
                type: 'success',
                title: 'All Rewards Claimed!',
                message: `Successfully claimed ${data.claimedAmount} USDT`
              });
            }
          } catch (error) {
            console.error('Failed to claim all rewards:', error);
            get().addNotification({
              type: 'error',
              title: 'Claim Failed',
              message: 'Failed to claim rewards'
            });
            
            set((state) => {
              state.claimingRewards = state.claimingRewards.filter(id => id !== 'all');
            });
          }
        },
        
        loadRewards: async (userAddress) => {
          try {
            const response = await fetch(`/api/rewards?address=${userAddress}`);
            const data = await response.json();
            
            if (data.success) {
              get().setRewards(data.rewards);
            }
          } catch (error) {
            console.error('Failed to load rewards:', error);
          }
        },
        
        // Leaderboard Actions
        setLeaderboard: (entries) => set((state) => {
          state.leaderboard = entries;
        }),
        
        setLeaderboardTimeframe: (timeframe) => set((state) => {
          state.leaderboardTimeframe = timeframe;
        }),
        
        loadLeaderboard: async (timeframe, userAddress) => {
          try {
            const params = new URLSearchParams({ timeframe });
            if (userAddress) params.append('userAddress', userAddress);
            
            const response = await fetch(`/api/leaderboard?${params}`);
            const data = await response.json();
            
            if (data.success) {
              get().setLeaderboard(data.leaderboard.entries);
            }
          } catch (error) {
            console.error('Failed to load leaderboard:', error);
          }
        },
        
        // UI Actions
        setSelectedTab: (tab) => set((state) => {
          state.selectedTab = tab;
        }),
        
        addNotification: (notification) => set((state) => {
          state.notifications.push({
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
          });
        }),
        
        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id);
        }),
        
        clearNotifications: () => set((state) => {
          state.notifications = [];
        })
      })),
      {
        name: 'ufo-game-store',
        partialize: (state) => ({
          userAddress: state.userAddress,
          userStats: state.userStats,
          selectedTab: state.selectedTab,
          leaderboardTimeframe: state.leaderboardTimeframe
        })
      }
    ),
    { name: 'UFO Game Store' }
  )
);

// Selectors pentru performance
export const useUserStats = () => useGameStore(state => state.userStats);
export const useActiveMissions = () => useGameStore(state => state.activeMissions);
export const useAvailableRewards = () => useGameStore(state => state.availableRewards);
export const useLeaderboard = () => useGameStore(state => state.leaderboard);
export const useNotifications = () => useGameStore(state => state.notifications);