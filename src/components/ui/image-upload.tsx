'use client'

import React, { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Upload, X, Loader2, ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from './button'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  className?: string
  disabled?: boolean
}

export function ImageUpload({ value, onChange, className, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.'
    }
    return null
  }

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
    // Reset input so the same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled || isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }, [disabled, isUploading])

  const handleRemove = () => {
    onChange(null)
    setError(null)
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click()
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-border">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-32 object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.png'
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
              disabled={disabled || isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="w-4 h-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all',
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-full bg-muted">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium">
                  {dragActive ? 'Drop image here' : 'Click or drag image'}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  JPEG, PNG, GIF, WebP • Max 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-destructive text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

