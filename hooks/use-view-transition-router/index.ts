'use client'

import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useLayoutEffect, useRef } from 'react'

// document.startViewTransitionに対応していないブラウザでの実行時は、単純にフォールバックする
const safeStartViewTransition = (callback: () => Promise<void> | void) => {
  if (!document.startViewTransition) {
    return void callback()
  }
  document.startViewTransition(callback)
}

export const useViewTransitionRouter = (): ReturnType<typeof useRouter> => {
  const router = useRouter()
  const pathname = usePathname()

  // ナビゲーション操作をPromiseで扱うためのrefオブジェクト。後述
  const promiseCallbacks = useRef<Record<'resolve' | 'reject', () => void> | null>(null)

  // pathnameが変更されたときにPromiseをresolveする。後述
  useLayoutEffect(() => {
    return () => {
      if (promiseCallbacks.current) {
        promiseCallbacks.current.resolve()
        promiseCallbacks.current = null
      }
    }
  }, [pathname])

  // 他のメソッドはそのままに、pushメソッドだけsafeStartViewTransitionでラップする
  return {
    ...router,
    push: (href: Route) => {
      safeStartViewTransition(
        () =>
          new Promise((resolve, reject) => {
            promiseCallbacks.current = { resolve, reject }
            router.push(href)
          })
      )
    },
  }
}
