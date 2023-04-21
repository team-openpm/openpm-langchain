import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RequestsGetTool, RequestsPostTool, Tool } from 'langchain/tools'
import { AutoGPT } from 'langchain/experimental/autogpt'
import { ReadFileTool, WriteFileTool, SerpAPI } from 'langchain/tools'
import { NodeFileStore } from 'langchain/stores/file/node'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

// Typically imported like this:
// import { OpenpmTool } from '@openpm/langchain'
import { OpenpmTool, ApiRequestsTool, openpmRequestDecorator } from '../src'
import { CallbackManager } from 'langchain/callbacks'

const apiKey = process.env.OPENPM_API_KEY

async function main() {
  // const tools = [
  // new ApiRequestsTool({
  //   onBeforeRequest: openpmRequestDecorator({ apiKey }),
  // }),
  // await OpenpmTool.fromPackageId('clearbit', { proxy: true }),
  // ]

  // const agent = await initializeAgentExecutorWithOptions(
  //   tools,
  //   new ChatOpenAI({ temperature: 0, modelName: 'gpt-4' }),
  //   {
  //     agentType: 'chat-conversational-react-description',
  //     verbose: true,
  //   }
  // )

  // const result = await agent.call({
  //   input:
  //     "using Clearbit's Enrichment API what is the company description of stripe.com?",
  // })

  // console.log({ result })

  const tools = [
    new ApiRequestsTool({
      onBeforeRequest: openpmRequestDecorator({ apiKey }),
    }),
    // await OpenpmTool.fromPackageId('clearbit', { proxy: true }),
  ]

  const vectorStore = new HNSWLib(new OpenAIEmbeddings(), {
    space: 'cosine',
    numDimensions: 1536,
  })

  const autogpt = AutoGPT.fromLLMAndTools(
    new ChatOpenAI({ temperature: 0, verbose: true, modelName: 'gpt-4' }),
    tools,
    {
      memory: vectorStore.asRetriever(),
      aiName: 'Tom',
      aiRole: 'Assistant',
    }
  )

  await autogpt.run(['What is the Clearbit company tags for stripe.com?'])
}

main()
