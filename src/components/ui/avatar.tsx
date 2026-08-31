import { cn } from '../../lib/cn.ts'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  className?: string
  name?: string
  size?: AvatarSize
  src?: string
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)

  return initials.toUpperCase() || '?'
}

export function Avatar({ className, name, size = 'md', src }: AvatarProps) {
  const accessibleName = name ? `${name} avatar` : 'Unassigned'

  return (
    <span aria-label={accessibleName} className={cn('avatar', `avatar--${size}`, className)} role="img">
      {src ? <img alt="" className="avatar__image" src={src} /> : getInitials(name ?? '')}
    </span>
  )
}
