import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RequestsGetTool, RequestsPostTool, SerpAPI } from 'langchain/tools'

// Typically imported like this:
// import { OpenpmTool } from '@openpm/langchain'
import { OpenpmTool } from '../src/langchain/openpm-tool'

async function main() {
  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: 'Austin,Texas,United States',
      hl: 'en',
      gl: 'us',
    }),
    await OpenpmTool.fromPackageId('open-meteo'),
  ]
  const agent = await initializeAgentExecutorWithOptions(
    tools,
    new ChatOpenAI({ temperature: 0, modelName: 'gpt-4' }),
    { agentType: 'chat-conversational-react-description', verbose: true }
  )

  const result = await agent.call({
    input: 'what is the 5 day forecast for Bath, England?',
  })

  console.log({ result })
}

main()
