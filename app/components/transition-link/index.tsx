'use client'

import type { LinkProps as NextLinkProps } from 'next/link'
import NextLink from 'next/link'
import type { ReactNode } from 'react'

import { useViewTransitionRouter } from '@/hooks/use-view-transition-router'

interface LinkProps extends NextLinkProps {
  children: ReactNode
  className?: string
  target?: string
}

export default function Link({ children, href, className, target, ...props }: LinkProps) {
  const router = useViewTransitionRouter()

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push(href.toString())
  }

  return (
    <NextLink
      className={className}
      href={href}
      target={target}
      onClick={handleLinkClick}
      {...props}
    >
      {children}
    </NextLink>
  )
}
