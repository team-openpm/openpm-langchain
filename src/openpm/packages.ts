import { Package } from './types'

interface GetPackageOptions {
  proxy?: boolean
}

export async function getPackage(
  packageId: string,
  { proxy }: GetPackageOptions
): Promise<Package> {
  const url = new URL(`https://openpm.ai/api/packages/${packageId}`)

  if (proxy) {
    url.searchParams.set('proxy', 'true')
  }

  const request = await fetch(url)

  if (!request.ok) {
    throw new Error(
      `Failed to fetch plugin from ${url} with status ${request.status}`
    )
  }

  const pkg = (await request.json()) as Package
  return pkg
}
