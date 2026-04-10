'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { fetchWithAuth } from '@/lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faXmark } from '@fortawesome/free-solid-svg-icons'

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
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-2xl" />
          <button
            type="button"
            onClick={() => { setPreview(''); onChange('') }}
            className="absolute -top-2 -right-2 bg-[#0A0A0A] text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-[#0A0A0A] bg-[#F5F5F5]' : 'border-[#E5E5E5] hover:border-[#0A0A0A] bg-white'
          }`}
        >
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faCamera} className="w-10 h-10 text-[#D4D4D4] mb-3" />
          <p className="font-display text-sm text-[#525252]">
            {isDragActive ? 'Drop it here!' : 'Tap to upload'}
          </p>
          <p className="text-[#A3A3A3] text-xs mt-1">JPG, PNG, WebP up to 10MB</p>
        </div>
      )}
      {uploading && (
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin mx-auto mb-1" />
          <span className="font-display text-xs text-[#A3A3A3]">Uploading...</span>
        </div>
      )}
    </div>
  )
}
