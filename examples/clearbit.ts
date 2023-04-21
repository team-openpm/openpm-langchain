import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RequestsGetTool, RequestsPostTool } from 'langchain/tools'

// Typically imported like this:
// import { OpenpmTool } from '@openpm/langchain'
import { OpenpmTool } from '../src/langchain/openpm-tool'

const apiKey = process.env.OPENPM_API_KEY

async function main() {
  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    await OpenpmTool.fromPackageId('clearbit', { proxy: true, apiKey }),
  ]
  const agent = await initializeAgentExecutorWithOptions(
    tools,
    new ChatOpenAI({ temperature: 0, modelName: 'gpt-4' }),
    { agentType: 'chat-conversational-react-description', verbose: true }
  )

  const result = await agent.call({
    input: 'using Clearbit what is the company description of stripe.com?',
  })

  console.log({ result })
}

main()
