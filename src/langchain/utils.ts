export function jsonStripNewlines(openapi: string) {
  return JSON.stringify(JSON.parse(openapi))
}
