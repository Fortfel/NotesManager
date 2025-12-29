import * as React from 'react'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'

interface CoverProps {
  filePath?: string
  onCoverChange: (filePath: string) => void
}

const Cover = ({ filePath, onCoverChange, className, ...props }: React.ComponentProps<'div'> & CoverProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onCoverChange(url)
    }
  }

  return (
    <div data-slot="cover" className={cn(className)} {...props}>
      {filePath ? (
        <img
          src={filePath}
          alt="Cover"
          className="max-h-[300px] w-full object-cover"
          onError={() => onCoverChange(`${import.meta.env.BASE_URL}placeholder.png`)}
        />
      ) : (
        <img
          src="https://placehold.co/1200x300/e2e8f0/64748b?text=Cover+Image"
          alt="Placeholder"
          className="max-h-[300px] w-full object-cover"
        />
      )}
      <Button variant="outline" onClick={handleUploadClick}>
        Upload
      </Button>
      <input type="file" ref={fileInputRef} onChange={handleCoverChange} className="hidden" />
    </div>
  )
}

export { Cover }
