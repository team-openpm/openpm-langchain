import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RequestsGetTool, RequestsPostTool } from 'langchain/tools'

// Typically imported like this:
// import { OpenpmTool } from '@openpm/langchain'
import { OpenpmTool } from '../src/langchain/openpm-tool'

async function main() {
  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    await OpenpmTool.fromPackageId('ipinfo'),
  ]
  const agent = await initializeAgentExecutorWithOptions(
    tools,
    new ChatOpenAI({ temperature: 0, modelName: 'gpt-4' }),
    { agentType: 'chat-conversational-react-description', verbose: true }
  )

  const result = await agent.call({
    input:
      'Can you tell me which country the IP address 98.97.176.253 is from?',
  })

  console.log({ result })
}

main()
