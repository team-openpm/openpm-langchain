const openpmOrigin = 'https://openpm.ai'

export function openpmRequestDecorator({ apiKey }: { apiKey?: string }) {
  return (request: Request) => {
    const url = new URL(request.url)

    // Check origin
    if (url.origin !== openpmOrigin) {
      return request
    }

    if (!apiKey && typeof process !== 'undefined') {
      apiKey = process?.env?.OPENPM_API_KEY
    }

    if (apiKey) {
      request.headers.set('Authorization', `Bearer ${apiKey}`)
    }

    return request
  }
}
