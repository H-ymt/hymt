import clsx from 'clsx'
import Link from 'next/link'

import styles from './index.module.css'

type ButtonProps = {
  size?: 'small' | 'medium' | 'large'
  visual?: 'primary' | 'secondary' | 'tertiary'
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
      <Link href={href} className={classNames} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  )
}
