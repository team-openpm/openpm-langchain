import { Tool } from 'langchain/tools'

export interface RequestTool {
  onBeforeRequest?: (request: Request) => Request
  onBeforeResponse?: (response: Response) => Response
}

export class ApiRequestsTool extends Tool implements RequestTool {
  name = 'api_requests'
  onBeforeRequest?: (request: Request) => Request
  onBeforeResponse?: (response: Response) => Response

  constructor(options: RequestTool = {}) {
    super()
    this.onBeforeRequest = options.onBeforeRequest
    this.onBeforeResponse = options.onBeforeResponse
  }

  /** @ignore */
  async _call(input: string) {
    try {
      const { url, data, method } = JSON.parse(input) as {
        url: string
        data: any | undefined
        method: string
      }

      let request = new Request(url, {
        method,
        body: data ? JSON.stringify(data) : undefined,
      })

      if (this.onBeforeRequest) {
        request = this.onBeforeRequest(request)
      }

      let response = await fetch(request)

      if (this.onBeforeResponse) {
        response = this.onBeforeResponse(response)
      }

      return response.text()
    } catch (error) {
      return `${error}`
    }
  }

  description = `A portal for making GET, POST, PUT, and DELETE requests to APIs. Use this when you need to interact with an API. 
    Input should be a json string with three keys: "url", "method" and "data".
    Url is a string, method is a string, and data is a dictionary of key-value pairs you want to send to the url as a JSON body.
    If you want to send a request with no body, you can omit the "data" key.
    The output will be the raw text response of the API response.`
}
