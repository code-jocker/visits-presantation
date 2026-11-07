// IMPORTANT: do not keep real API keys hardcoded.
// Ensure VITE_NUMVERIFY_API_KEY is set in your environment (.env) and restarted.
const NUMVERIFY_API_KEY = import.meta.env.VITE_NUMVERIFY_API_KEY



type NumverifyResponse = {
  valid: boolean
  number: string
  country: { name?: string; iso2?: string; iso3?: string }
  location?: string
  line_type?: string
  valid_format?: boolean
  valid_location?: boolean
}

type NumverifyErrorResponse = {
  success?: boolean
  error?: { info?: string }
}

type NumverifyApiResponse = NumverifyResponse & NumverifyErrorResponse

type ValidatePhoneResult = {
  isValid: boolean
  normalizedPhone: string
  details: NumverifyApiResponse
}

function normalizePhoneInput(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ''

  // If user enters 00 prefix (common international dial prefix), convert it to +
  // e.g. 00 2507.... => +2507...
  const withPlus = trimmed.replace(/^00+/, '+')

  // Keep + and digits only. Ensure + only appears at the start.
  const cleaned = withPlus.replace(/[^\d+]/g, '')
  const plusStripped = cleaned.replace(/(?!^\+)./g, (c) => (c === '+' ? '' : c))

  return plusStripped
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms))
}

function getRetryDelayMs(attempt: number) {
  // attempt: 0,1,... => 300,600,1200...
  return 300 * Math.pow(2, attempt)
}

export async function validatePhoneWithNumverify(params: {
  phone: string
  countryCode?: string
}): Promise<{ isValid: boolean; normalizedPhone?: string; details?: Partial<NumverifyResponse> }> {
  const { phone } = params

  if (!NUMVERIFY_API_KEY) {
    throw new Error('Numverify API key is missing (VITE_NUMVERIFY_API_KEY)')
  }


  const normalized = normalizePhoneInput(phone)

  if (!normalized) {
    return { isValid: false, normalizedPhone: '', details: undefined }
  }

  // Some users include spaces/country prefix multiple times; ensure final request contains digits(+ optional leading +)
  const finalNormalized = normalized.replace(/(?!^\+)./g, (c) => (c === '+' ? '' : c))

  if (!finalNormalized) {
    return { isValid: false, normalizedPhone: '', details: undefined }
  }

  const url = new URL('https://apilayer.net/api/validate')
  url.searchParams.set('access_key', NUMVERIFY_API_KEY)
  url.searchParams.set('number', finalNormalized)

  url.searchParams.set('country_code', params.countryCode || '')
  url.searchParams.set('format', '1')
  url.searchParams.set('no_ddd', '1')

  const maxAttempts = 3
  let lastError: unknown

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch(url.toString())

      if (!res.ok) {
        // Retry on common transient cases
        if (res.status === 429 || (res.status >= 500 && res.status <= 599)) {
          const delay = getRetryDelayMs(attempt)
          await sleep(delay)
          continue
        }

        // Try to parse json error payload for better debugging UX
        let errorPayload: any = null
        try {
          errorPayload = await res.json()
        } catch {
          errorPayload = await res.text().catch(() => '')
        }

        throw new Error(`Numverify request failed: ${res.status} ${typeof errorPayload === 'string' ? errorPayload : JSON.stringify(errorPayload)}`)
      }

      const data = (await res.json()) as NumverifyApiResponse

      const isValid = Boolean((data as any).valid)
      const normalizedPhone = data.number || normalized

      const result: ValidatePhoneResult = {
        isValid,
        normalizedPhone,
        details: data,
      }

      return {
        isValid: result.isValid,
        normalizedPhone: result.normalizedPhone,
        details: result.details,
      }
    } catch (e) {
      lastError = e

      if (attempt < maxAttempts - 1) {
        const delay = getRetryDelayMs(attempt)
        await sleep(delay)
        continue
      }

      // If api-layer returns json error payloads, try to include info
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw e
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Numverify request failed')
}

