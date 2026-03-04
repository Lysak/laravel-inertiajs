// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { resolveCsrfToken, type CsrfDocument } from './csrf'

type MetaElementLike = {
    getAttribute: (name: string) => string | null
}

function createDocumentLike({
    cookie = '',
    metaToken = null,
}: {
    cookie?: string
    metaToken?: string | null
}): CsrfDocument {
    return {
        cookie,
        querySelector: (selector: string) => {
            if (selector !== 'meta[name="csrf-token"]' || metaToken === null) {
                return null
            }

            const metaElement: MetaElementLike = {
                getAttribute: (name: string) => (name === 'content' ? metaToken : null),
            }

            return metaElement as HTMLMetaElement
        },
    }
}

function TokenProbe({ documentLike }: { documentLike: CsrfDocument }): ReactElement {
    return <output>{resolveCsrfToken(documentLike) ?? 'missing'}</output>
}

describe('resolveCsrfToken', () => {
    it('prefers the current XSRF cookie over the meta tag', () => {
        render(
            <TokenProbe
                documentLike={createDocumentLike({
                    cookie: 'foo=bar; XSRF-TOKEN=current%20cookie%20token',
                    metaToken: 'stale-meta-token',
                })}
            />,
        )

        expect(screen.getByText('current cookie token')).toBeTruthy()
    })

    it('falls back to the csrf meta tag when the XSRF cookie is absent', () => {
        render(
            <TokenProbe
                documentLike={createDocumentLike({
                    metaToken: 'meta-token',
                })}
            />,
        )

        expect(screen.getByText('meta-token')).toBeTruthy()
    })

    it('reads an updated XSRF cookie value after an auth-style token rotation', () => {
        const documentLike = createDocumentLike({
            cookie: 'XSRF-TOKEN=guest-token',
            metaToken: 'guest-meta-token',
        })

        const { rerender } = render(<TokenProbe documentLike={documentLike} />)

        expect(screen.getByText('guest-token')).toBeTruthy()

        documentLike.cookie = 'XSRF-TOKEN=authenticated-token'

        rerender(<TokenProbe documentLike={documentLike} />)

        expect(screen.getByText('authenticated-token')).toBeTruthy()
    })
})
