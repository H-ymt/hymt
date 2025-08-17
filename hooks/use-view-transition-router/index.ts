'use client'

import { useLayoutEffect, useRef } from 'react'

import { usePathname, useRouter } from '@/i18n/navigation'

const safeStartViewTransition = (callback: () => Promise<void> | void) => {
  if (!document.startViewTransition) {
    return void callback()
  }
  document.startViewTransition(callback)
}

export const useViewTransitionRouter = (): ReturnType<typeof useRouter> => {
  const router = useRouter()
  const pathname = usePathname()

  const promiseCallbacks = useRef<Record<'resolve' | 'reject', () => void> | null>(null)

  useLayoutEffect(() => {
    return () => {
      if (promiseCallbacks.current) {
        promiseCallbacks.current.resolve()
        promiseCallbacks.current = null
      }
    }
  }, [pathname])

  return {
    ...router,
    // keep same signature as next/navigation's router.push
    push: (href: Parameters<typeof router.push>[0], options?: Parameters<typeof router.push>[1]) => {
      safeStartViewTransition(
        () =>
          new Promise((resolve, reject) => {
            promiseCallbacks.current = { resolve, reject }
            // forward href and options to the original router
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore-next-line: forwarding typed parameters
            router.push(href, options)
          })
      )
    },
  }
}
