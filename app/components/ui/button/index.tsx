import clsx from 'clsx'

import TransitionLink from '@/app/components/transition-link'

import styles from './index.module.css'

type ButtonProps = {
  size?: 'small' | 'medium' | 'large'
  visual?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
  className?: string
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
}

export default function Button({
  size = 'medium',
  visual = 'primary',
  children,
  className,
  href,
  ...props
}: ButtonProps) {
  const classNames = clsx(styles.button, styles[size], styles[visual], className)

  if (href) {
    return (
      <TransitionLink href={href} className={classNames} {...props}>
        {children}
      </TransitionLink>
    )
  }

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  )
}
