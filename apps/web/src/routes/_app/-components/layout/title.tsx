import * as React from 'react'

import { cn } from '@workspace/ui/lib/utils'

interface TitleProps {
  title: string
  onTitleChange: (title: string) => void
  onEnterKeyDown: () => void
}

const Title = ({
  title,
  onTitleChange,
  onEnterKeyDown,
  className,
  ...props
}: React.ComponentProps<'div'> & TitleProps) => {
  const headerRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    const isFocused = document.activeElement === headerRef.current
    if (!isFocused && headerRef.current) {
      headerRef.current.textContent = title
    }
  }, [title])

  return (
    <div data-slot="title" className={cn(className)} {...props}>
      {/* eslint-disable-next-line jsx-a11y/heading-has-content, jsx-a11y/no-noninteractive-element-interactions */}
      <h1
        contentEditable={true}
        suppressContentEditableWarning={true}
        ref={headerRef}
        onInput={(e) => {
          onTitleChange(e.currentTarget.textContent || '')
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onEnterKeyDown()
          }
        }}
        className="text-3xl font-bold"
      />
    </div>
  )
}

export { Title }
