import { Package } from './types'

export async function getPackage(packageId: string): Promise<Package> {
  const url = `https://openpm.ai/api/packages/${packageId}`
  const request = await fetch(url)

  if (!request.ok) {
    throw new Error(
      `Failed to fetch plugin from ${url} with status ${request.status}`
    )
  }

  const pkg = (await request.json()) as Package
  return pkg
}
