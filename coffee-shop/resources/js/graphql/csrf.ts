export type CsrfDocument = Pick<Document, 'cookie' | 'querySelector'>

const CSRF_META_SELECTOR = 'meta[name="csrf-token"]'
const XSRF_COOKIE_NAME = 'XSRF-TOKEN'

export function getCookieValue(cookieString: string, name: string): string | null {
    const prefix = `${name}=`

    for (const cookie of cookieString.split(';')) {
        const normalizedCookie = cookie.trim()

        if (normalizedCookie.startsWith(prefix)) {
            return normalizedCookie.slice(prefix.length)
        }
    }

    return null
}

export function resolveCsrfToken(source: CsrfDocument = document): string | null {
    const xsrfToken = getCookieValue(source.cookie, XSRF_COOKIE_NAME)

    if (xsrfToken !== null) {
        try {
            return decodeURIComponent(xsrfToken)
        } catch {
            return xsrfToken
        }
    }

    return (
        source.querySelector<HTMLMetaElement>(CSRF_META_SELECTOR)?.getAttribute('content') ?? null
    )
}
