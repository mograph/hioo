'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { fetchWithAuth } from '@/lib/api'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value || '')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetchWithAuth('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        onChange(data.url)
        setPreview(data.url)
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
  })

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative">
          <div className="polaroid inline-block">
            <img src={preview} alt="Preview" className="w-48 h-48 object-cover" />
          </div>
          <button
            type="button"
            onClick={() => { setPreview(''); onChange('') }}
            className="absolute top-0 right-0 bg-[#cc2200] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-[#cc2200] bg-[#cc2200]/10' : 'border-[#c8a06a]/60 hover:border-[#c8a06a] bg-[#faf5e4]/20'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-4xl mb-2">📸</div>
          <p className="font-handwritten text-[#faf5e4] text-lg">
            {isDragActive ? 'Drop it here!' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-[#faf5e4]/60 text-xs mt-1">JPG, PNG, WebP up to 10MB</p>
        </div>
      )}
      {uploading && (
        <div className="text-center">
          <span className="font-handwritten text-[#faf5e4]/70 animate-pulse">Uploading...</span>
        </div>
      )}
    </div>
  )
}
