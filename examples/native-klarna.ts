import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import {
  AIPluginTool,
  RequestsGetTool,
  RequestsPostTool,
} from 'langchain/tools'

// Typically imported like this:
// import { OpenpmTool } from '@openpm/langchain'
import { OpenpmTool } from '../src/langchain/openpm-tool'
import { CallbackManager } from 'langchain/callbacks'

async function main() {
  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    await AIPluginTool.fromPluginUrl(
      'https://www.klarna.com/.well-known/ai-plugin.json'
    ),
  ]
  const agent = await initializeAgentExecutorWithOptions(
    tools,
    new ChatOpenAI({ temperature: 0, modelName: 'gpt-4' }),
    {
      agentType: 'chat-conversational-react-description',
      verbose: true,
      callbackManager: CallbackManager.fromHandlers({
        handleAgentAction: async action => {
          console.log('handleAgentAction', { action })
        },
        handleLLMStart: async (llm, prompts) => {
          console.log('handleLLMStart', { prompts })
        },
      }),
    }
  )

  const result = await agent.call({
    input: 'what t shirts are available in klarna?',
  })

  console.log({ result })
}

main()
