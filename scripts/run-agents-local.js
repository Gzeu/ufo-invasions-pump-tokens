const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

/**
 * Local Agent Runner
 * Testeză agenții local înainte de deployment
 */

async function runAgentsLocal() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  console.log('🤖 Running UFO Invasions agents locally...');
  console.log(`🗺️ Base URL: ${baseUrl}`);
  
  const agents = [
    { name: 'Mission Manager', path: '/api/agents/mission-manager' },
    { name: 'Reward Processor', path: '/api/agents/reward-processor' },
    { name: 'Beam Technology', path: '/api/agents/beam-technology' },
    { name: 'Orchestrator', path: '/api/agents/orchestrator' }
  ];
  
  const results = [];
  
  for (const agent of agents) {
    console.log(`\n🔄 Running ${agent.name}...`);
    const startTime = Date.now();
    
    try {
      const response = await axios.post(`${baseUrl}${agent.path}`, {}, {
        timeout: 25000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'UFO-Agent-Runner/1.0'
        }
      });
      
      const duration = Date.now() - startTime;
      console.log(`✅ ${agent.name} completed in ${duration}ms`);
      
      if (response.data.processed !== undefined) {
        console.log(`   📊 Processed: ${response.data.processed}`);
      }
      if (response.data.completed !== undefined) {
        console.log(`   ✅ Completed: ${response.data.completed}`);
      }
      if (response.data.beamed !== undefined) {
        console.log(`   🛸 Beamed: ${response.data.beamed}`);
      }
      
      results.push({
        agent: agent.name,
        status: 'success',
        duration,
        data: response.data
      });
      
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`❌ ${agent.name} failed in ${duration}ms`);
      
      if (error.response) {
        console.log(`   Error: ${error.response.status} - ${error.response.data.error || error.response.statusText}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
      
      results.push({
        agent: agent.name,
        status: 'failed',
        duration,
        error: error.message
      });
    }
    
    // Delay between agents
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📊 Agent Execution Summary:');
  const successful = results.filter(r => r.status === 'success').length;
  console.log(`Success Rate: ${successful}/${results.length} (${((successful/results.length)*100).toFixed(1)}%)`);
  
  results.forEach(result => {
    const statusIcon = result.status === 'success' ? '✅' : '❌';
    console.log(`${statusIcon} ${result.agent}: ${result.duration}ms`);
  });
  
  console.log('\n🎆 Local agent testing completed!');
  
  if (successful === results.length) {
    console.log('🚀 All agents working correctly - ready for production!');
  } else {
    console.log('⚠️ Some agents failed - check logs before deploying');
    process.exit(1);
  }
}

runAgentsLocal();