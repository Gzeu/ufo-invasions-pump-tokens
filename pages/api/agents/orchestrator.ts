import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * Agent Orchestrator
 * Coordonează execuția tuturor agenților într-o secvență optimizată
 * Poate fi apelat manual, prin cron job sau webhook
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  const maxExecutionTime = 28000; // 28s safety margin pentru Vercel
  
  try {
    const baseUrl = process.env.VERCEL_URL ? 
      `https://${process.env.VERCEL_URL}` : 
      process.env.NEXT_PUBLIC_APP_URL || 
      'http://localhost:3000';

    const results: any = {
      timestamp: new Date().toISOString(),
      executionId: Math.random().toString(36).substr(2, 9),
      agents: {}
    };

    // 1. Mission Manager - highest priority
    console.log('🎯 Running Mission Manager...');
    if (Date.now() - startTime < maxExecutionTime - 10000) {
      try {
        const missionResult = await axios.post(`${baseUrl}/api/agents/mission-manager`, {}, {
          timeout: 8000
        });
        results.agents.missionManager = {
          status: 'success',
          data: missionResult.data,
          duration: missionResult.data.executionTime
        };
      } catch (error) {
        results.agents.missionManager = {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // 2. Reward Processor - second priority
    console.log('💰 Running Reward Processor...');
    if (Date.now() - startTime < maxExecutionTime - 5000) {
      try {
        const rewardResult = await axios.post(`${baseUrl}/api/agents/reward-processor`, {}, {
          timeout: 8000
        });
        results.agents.rewardProcessor = {
          status: 'success',
          data: rewardResult.data,
          duration: rewardResult.data.executionTime
        };
      } catch (error) {
        results.agents.rewardProcessor = {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    // 3. Beam Technology - probabilistic execution (20% chance)
    const shouldRunBeam = Math.random() < 0.2;
    if (shouldRunBeam && Date.now() - startTime < maxExecutionTime - 3000) {
      console.log('🛸 Running Beam Technology...');
      try {
        const beamResult = await axios.post(`${baseUrl}/api/agents/beam-technology`, {}, {
          timeout: 6000
        });
        results.agents.beamTechnology = {
          status: 'success',
          data: beamResult.data,
          duration: beamResult.data.executionTime
        };
      } catch (error) {
        results.agents.beamTechnology = {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    } else {
      results.agents.beamTechnology = {
        status: shouldRunBeam ? 'skipped_timeout' : 'skipped_probability',
        reason: shouldRunBeam ? 'Insufficient time remaining' : '80% probability skip'
      };
    }

    // Calculate execution summary
    const agentKeys = Object.keys(results.agents);
    const successCount = agentKeys.filter(
      key => results.agents[key].status === 'success'
    ).length;
    const totalExecutionTime = Date.now() - startTime;

    // Log execution summary
    console.log(`Orchestrator: ${successCount}/${agentKeys.length} agents successful in ${totalExecutionTime}ms`);

    res.status(200).json({
      message: '🤖 Agent orchestration completed',
      summary: {
        successRate: `${((successCount / agentKeys.length) * 100).toFixed(1)}%`,
        executedAgents: agentKeys.length,
        successfulAgents: successCount,
        totalExecutionTime
      },
      ...results
    });

  } catch (error) {
    console.error('Agent orchestrator error:', error);
    res.status(500).json({ 
      error: 'Agent orchestrator execution failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  }
}