'use client'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons'

interface Props {
  originalBlob: Blob
  originalPreview: string
  onComplete: (processedBlob: Blob) => void
  onSkip: () => void
}

export default function BackgroundRemoval({ originalBlob, originalPreview, onComplete, onSkip }: Props) {
  const [status, setStatus] = useState<'processing' | 'done' | 'error'>('processing')
  const [progress, setProgress] = useState(0)
  const [processedUrl, setProcessedUrl] = useState('')
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function process() {
      try {
        const { removeImageBackground } = await import('@/lib/backgroundRemoval')
        const result = await removeImageBackground(originalBlob, (pct) => {
          if (!cancelled) setProgress(pct)
        })
        if (!cancelled) {
          setProcessedBlob(result)
          setProcessedUrl(URL.createObjectURL(result))
          setStatus('done')
        }
      } catch (err) {
        console.error('Background removal failed:', err)
        if (!cancelled) setStatus('error')
      }
    }

    process()
    return () => { cancelled = true }
  }, [originalBlob])

  if (status === 'processing') {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="w-5 h-5 text-[#6D28D9] animate-pulse" />
        </div>
        <p className="font-display text-base text-[#0A0A0A] mb-2">Removing background...</p>
        <div className="w-full bg-[#F5F5F5] rounded-full h-2 mb-2">
          <div className="bg-[#6D28D9] h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-[#A3A3A3]">{progress < 30 ? 'Loading AI model...' : progress < 80 ? 'Processing image...' : 'Almost done...'}</p>
        <button onClick={onSkip} className="text-xs text-[#A3A3A3] hover:text-[#525252] mt-4">Skip</button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center">
        <p className="font-display text-sm text-[#0A0A0A] mb-3">Couldn't remove background</p>
        <button onClick={onSkip} className="btn-primary !py-2.5 !text-sm">Continue with original</button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
      {/* Before/After toggle */}
      <div className="relative aspect-square bg-[#F5F5F5]" style={{ backgroundImage: 'repeating-conic-gradient(#E5E5E5 0% 25%, transparent 0% 50%)', backgroundSize: '20px 20px' }}>
        <img
          src={showOriginal ? originalPreview : processedUrl}
          alt=""
          className="w-full h-full object-contain"
        />
        <div className="absolute bottom-3 left-3 right-3 flex gap-1">
          <button
            onClick={() => setShowOriginal(true)}
            className={`flex-1 py-1.5 rounded-full text-[10px] font-display backdrop-blur-md transition-all ${showOriginal ? 'bg-[#0A0A0A] text-white' : 'bg-white/70 text-[#525252]'}`}
          >
            Original
          </button>
          <button
            onClick={() => setShowOriginal(false)}
            className={`flex-1 py-1.5 rounded-full text-[10px] font-display backdrop-blur-md transition-all ${!showOriginal ? 'bg-[#0A0A0A] text-white' : 'bg-white/70 text-[#525252]'}`}
          >
            Removed
          </button>
        </div>
      </div>
      <div className="p-4 flex gap-2">
        <button onClick={() => processedBlob && onComplete(processedBlob)}
          className="flex-1 btn-primary !py-2.5 !text-sm flex items-center justify-center gap-1.5">
          <FontAwesomeIcon icon={faCheck} className="w-3 h-3" /> Use Clean
        </button>
        <button onClick={onSkip}
          className="btn-secondary !py-2.5 !text-sm flex items-center justify-center gap-1.5">
          Keep Original <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
