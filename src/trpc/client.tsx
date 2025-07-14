'use client';
import type { QueryClient } from '@tanstack/react-query'

import { QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { useState } from 'react';

import { makeQueryClient } from './query-client';
import superjson from 'superjson'
import type { AppRouter } from './routers/_app'
import { APP_URL } from '@/constants';
export const trpc = createTRPCReact<AppRouter>();
let clientQueryClientSingleton: QueryClient;
function getQueryClient() {
    if (typeof window === 'undefined') {
        return makeQueryClient()
    }
    return (clientQueryClientSingleton ??= makeQueryClient())
}
function getUrl() {
    const base = (() => {
        if (typeof window !== 'undefined') return '';
        console.log(APP_URL
        )
        return APP_URL;
    })();
    return `${base}/api/trpc`
}
export function TRPCProvider(
    props: Readonly<{ children: React.ReactNode }>
) {
    const QueryClient = getQueryClient()
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    transformer: superjson,
                    url: getUrl(),
                    async headers() {
                        const headers = new Headers()
                        headers.set('x-trpc-source', 'nextjs-react')
                        return headers
                    }
                })
            ]
        })
    )
    return (
        <trpc.Provider client={trpcClient} queryClient={QueryClient}>
            <QueryClientProvider client={QueryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}