'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthContext'
import { db } from '@/lib/firebase'
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

const DEMO_ITEMS = [
  { id: 'item_01', name: 'White Linen Button-Down', category: 'tops', color: 'white', brand: 'Everlane', occasions: 'casual,business', seasons: 'spring,summer', price: 78, timesWorn: 24, purchaseDate: '2025-03-15' },
  { id: 'item_02', name: 'Black Fitted Tee', category: 'tops', color: 'black', brand: 'COS', occasions: 'casual', seasons: 'spring,summer,fall', price: 35, timesWorn: 42, purchaseDate: '2024-09-01' },
  { id: 'item_03', name: 'Navy Breton Stripe', category: 'tops', color: 'navy', brand: 'Saint James', occasions: 'casual', seasons: 'spring,fall', price: 95, timesWorn: 18, purchaseDate: '2025-05-20' },
  { id: 'item_04', name: 'Cream Cashmere Sweater', category: 'tops', color: 'beige', brand: 'Naadam', occasions: 'casual,business', seasons: 'fall,winter', price: 145, timesWorn: 31, purchaseDate: '2024-11-10' },
  { id: 'item_05', name: 'Sage Silk Blouse', category: 'tops', color: 'green', brand: 'Reformation', occasions: 'business,formal', seasons: 'spring,summer,fall', price: 128, timesWorn: 12, purchaseDate: '2025-07-05' },
  { id: 'item_06', name: 'Grey Oversized Hoodie', category: 'tops', color: 'gray', brand: 'Nike', occasions: 'casual', seasons: 'fall,winter', price: 65, timesWorn: 38, purchaseDate: '2024-08-20' },
  { id: 'item_07', name: 'Rust Ribbed Tank', category: 'tops', color: 'orange', brand: 'Aritzia', occasions: 'casual', seasons: 'summer', price: 30, timesWorn: 15, purchaseDate: '2025-06-01' },
  { id: 'item_08', name: 'Lavender Cropped Cardigan', category: 'tops', color: 'purple', brand: 'Sezane', occasions: 'casual,business', seasons: 'spring,fall', price: 115, timesWorn: 8, purchaseDate: '2025-09-15' },
  { id: 'item_09', name: 'High-Rise Straight Jeans', category: 'bottoms', color: 'blue', brand: 'AGOLDE', occasions: 'casual', seasons: 'spring,summer,fall,winter', price: 198, timesWorn: 56, purchaseDate: '2024-06-15' },
  { id: 'item_10', name: 'Black Tailored Trousers', category: 'bottoms', color: 'black', brand: 'Theory', occasions: 'business,formal', seasons: 'spring,summer,fall,winter', price: 265, timesWorn: 33, purchaseDate: '2024-10-01' },
  { id: 'item_11', name: 'Olive Cargo Pants', category: 'bottoms', color: 'green', brand: 'Zara', occasions: 'casual', seasons: 'spring,fall', price: 55, timesWorn: 20, purchaseDate: '2025-04-10' },
  { id: 'item_12', name: 'Cream Linen Midi Skirt', category: 'bottoms', color: 'beige', brand: 'Reformation', occasions: 'casual,business', seasons: 'spring,summer', price: 148, timesWorn: 9, purchaseDate: '2025-05-25' },
  { id: 'item_13', name: 'Pleated Wool Trousers', category: 'bottoms', color: 'brown', brand: 'COS', occasions: 'business,formal', seasons: 'fall,winter', price: 135, timesWorn: 14, purchaseDate: '2025-01-20' },
  { id: 'item_14', name: 'White Leather Sneakers', category: 'shoes', color: 'white', brand: 'Veja', occasions: 'casual', seasons: 'spring,summer,fall', price: 150, timesWorn: 60, purchaseDate: '2024-05-01' },
  { id: 'item_15', name: 'Black Chelsea Boots', category: 'shoes', color: 'black', brand: 'Blundstone', occasions: 'casual,business', seasons: 'fall,winter', price: 210, timesWorn: 45, purchaseDate: '2024-09-20' },
  { id: 'item_16', name: 'Tan Leather Sandals', category: 'shoes', color: 'brown', brand: 'Ancient Greek Sandals', occasions: 'casual', seasons: 'summer', price: 195, timesWorn: 22, purchaseDate: '2025-06-10' },
  { id: 'item_17', name: 'Nude Pointed Heels', category: 'shoes', color: 'beige', brand: 'Sam Edelman', occasions: 'formal,business', seasons: 'spring,summer,fall', price: 140, timesWorn: 7, purchaseDate: '2025-08-01' },
  { id: 'item_18', name: 'Camel Wool Coat', category: 'outerwear', color: 'brown', brand: 'Max Mara', occasions: 'casual,business,formal', seasons: 'fall,winter', price: 520, timesWorn: 28, purchaseDate: '2024-10-15' },
  { id: 'item_19', name: 'Black Leather Jacket', category: 'outerwear', color: 'black', brand: 'AllSaints', occasions: 'casual', seasons: 'spring,fall', price: 450, timesWorn: 35, purchaseDate: '2024-04-10' },
  { id: 'item_20', name: 'Olive Rain Jacket', category: 'outerwear', color: 'green', brand: 'Rains', occasions: 'casual', seasons: 'spring,fall', price: 110, timesWorn: 16, purchaseDate: '2025-03-01' },
  { id: 'item_21', name: 'Denim Jacket', category: 'outerwear', color: 'blue', brand: "Levi's", occasions: 'casual', seasons: 'spring,summer,fall', price: 98, timesWorn: 21, purchaseDate: '2025-02-14' },
  { id: 'item_22', name: 'Gold Chain Necklace', category: 'accessories', color: 'yellow', brand: 'Mejuri', occasions: 'casual,business,formal', seasons: 'spring,summer,fall,winter', price: 85, timesWorn: 48, purchaseDate: '2024-12-25' },
  { id: 'item_23', name: 'Tan Leather Belt', category: 'accessories', color: 'brown', brand: 'Madewell', occasions: 'casual,business', seasons: 'spring,summer,fall,winter', price: 48, timesWorn: 30, purchaseDate: '2024-07-15' },
  { id: 'item_24', name: 'Silk Scarf', category: 'accessories', color: 'pink', brand: 'Toteme', occasions: 'casual,business', seasons: 'spring,fall', price: 190, timesWorn: 11, purchaseDate: '2025-04-20' },
  { id: 'item_25', name: 'Black Leather Tote', category: 'accessories', color: 'black', brand: 'Cuyana', occasions: 'casual,business', seasons: 'spring,summer,fall,winter', price: 248, timesWorn: 52, purchaseDate: '2024-03-01' },
  { id: 'item_26', name: 'Straw Bucket Hat', category: 'accessories', color: 'beige', brand: 'Lack of Color', occasions: 'casual', seasons: 'summer', price: 70, timesWorn: 6, purchaseDate: '2025-07-01' },
]

const DEMO_OUTFITS = [
  { id: 'outfit_01', name: 'Effortless Monday', occasion: 'business', date: '2026-03-23', itemIds: ['item_01', 'item_10', 'item_17', 'item_22'] },
  { id: 'outfit_02', name: 'Weekend Coffee Run', occasion: 'casual', date: '2026-03-22', itemIds: ['item_02', 'item_09', 'item_14', 'item_25'] },
  { id: 'outfit_03', name: 'Spring Brunch', occasion: 'casual', date: '2026-03-21', itemIds: ['item_05', 'item_12', 'item_16', 'item_24'] },
  { id: 'outfit_04', name: 'Dinner Date', occasion: 'formal', date: '2026-03-20', itemIds: ['item_02', 'item_10', 'item_15', 'item_18', 'item_22'] },
  { id: 'outfit_05', name: 'Rainy Day Layers', occasion: 'casual', date: '2026-03-19', itemIds: ['item_04', 'item_11', 'item_15', 'item_20'] },
  { id: 'outfit_06', name: 'French Girl Friday', occasion: 'casual', date: '2026-03-18', itemIds: ['item_03', 'item_09', 'item_14', 'item_23'] },
  { id: 'outfit_07', name: 'Cozy WFH', occasion: 'casual', date: '2026-03-17', itemIds: ['item_06', 'item_09', 'item_14'] },
  { id: 'outfit_08', name: 'Summer Office', occasion: 'business', date: '2026-03-16', itemIds: ['item_08', 'item_13', 'item_17', 'item_25'] },
]

const DEMO_WEARLOGS = [
  { outfitId: 'outfit_01', date: '2026-03-23', notes: 'Felt put-together all day' },
  { outfitId: 'outfit_02', date: '2026-03-22', notes: 'Perfect for a chill Saturday' },
  { outfitId: 'outfit_03', date: '2026-03-21', notes: 'Got compliments on the scarf' },
  { outfitId: 'outfit_04', date: '2026-03-20', notes: 'Classic and reliable' },
  { outfitId: 'outfit_05', date: '2026-03-19', notes: 'Stayed dry and warm' },
  { outfitId: 'outfit_06', date: '2026-03-18', notes: null },
  { outfitId: 'outfit_07', date: '2026-03-17', notes: null },
  { outfitId: 'outfit_08', date: '2026-03-16', notes: 'Love this combo' },
  { outfitId: 'outfit_02', date: '2026-03-15', notes: null },
  { outfitId: 'outfit_01', date: '2026-03-14', notes: null },
  { outfitId: 'outfit_06', date: '2026-03-13', notes: null },
  { outfitId: 'outfit_04', date: '2026-03-12', notes: 'Wore this again' },
  { outfitId: 'outfit_07', date: '2026-03-11', notes: null },
  { outfitId: 'outfit_03', date: '2026-03-10', notes: null },
  { outfitId: 'outfit_05', date: '2026-03-09', notes: null },
  { outfitId: 'outfit_02', date: '2026-03-08', notes: null },
  { outfitId: 'outfit_01', date: '2026-03-07', notes: null },
  { outfitId: 'outfit_08', date: '2026-03-06', notes: null },
  { outfitId: 'outfit_06', date: '2026-03-05', notes: null },
  { outfitId: 'outfit_04', date: '2026-03-04', notes: null },
]

export default function DemoPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState('')

  if (loading) return null

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-2xl font-medium text-[#1a1a1a] mb-3">Load Demo Data</h1>
        <p className="text-[#6b6157] text-sm mb-6">Sign in first, then come back here to load demo wardrobe data.</p>
        <a href="/auth/login" className="btn-primary">Sign In</a>
      </div>
    )
  }

  const loadDemoData = async () => {
    setStatus('loading')
    try {
      const userId = user.uid

      setProgress('Adding clothing items...')
      const batch1 = writeBatch(db)
      const now = new Date().toISOString()
      for (const item of DEMO_ITEMS) {
        const ref = doc(db, 'users', userId, 'items', item.id)
        batch1.set(ref, {
          name: item.name,
          category: item.category,
          color: item.color,
          brand: item.brand,
          occasions: item.occasions,
          seasons: item.seasons,
          price: item.price,
          timesWorn: item.timesWorn,
          purchaseDate: item.purchaseDate,
          imageUrl: null,
          createdAt: now,
          updatedAt: now,
        })
      }
      await batch1.commit()

      setProgress('Creating outfits...')
      const batch2 = writeBatch(db)
      for (const outfit of DEMO_OUTFITS) {
        const ref = doc(db, 'users', userId, 'outfits', outfit.id)
        batch2.set(ref, {
          name: outfit.name,
          occasion: outfit.occasion,
          date: outfit.date,
          imageUrl: null,
          itemIds: outfit.itemIds,
          createdAt: now,
          updatedAt: now,
        })
      }
      await batch2.commit()

      setProgress('Logging wear history...')
      const batch3 = writeBatch(db)
      DEMO_WEARLOGS.forEach((log, i) => {
        const ref = doc(db, 'users', userId, 'wearLogs', `wl_${String(i + 1).padStart(3, '0')}`)
        batch3.set(ref, {
          outfitId: log.outfitId,
          date: log.date,
          notes: log.notes,
          createdAt: log.date,
        })
      })
      await batch3.commit()

      // Update user profile
      await setDoc(doc(db, 'users', userId), {
        email: user.email,
        name: user.displayName || 'Demo User',
        measurements: { height: '5\'6"', bust: '34', waist: '26', hips: '36', shoe: '7.5' },
        createdAt: now,
      }, { merge: true })

      setProgress('Done! 26 items, 8 outfits, 20 wear logs loaded.')
      setStatus('done')
    } catch (err: any) {
      console.error(err)
      setProgress(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-10 pb-nav">
      <div className="text-center mb-8">
        <div className="inline-block bg-[#EDE9FE] rounded-full px-4 py-1.5 mb-4">
          <span className="font-display text-sm font-bold text-[#6D28D9]">Demo Mode</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight mb-2">Load Demo Data</h1>
        <p className="text-[#A3A3A3] text-sm">Fill your wardrobe with sample pieces to explore the app.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center">
        {status === 'idle' && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#FFE0D0] rounded-2xl p-4">
                <p className="font-display text-3xl font-bold text-[#FF6B35]">26</p>
                <p className="text-[10px] font-display font-bold text-[#525252] uppercase">Items</p>
              </div>
              <div className="bg-[#E0F2FE] rounded-2xl p-4">
                <p className="font-display text-3xl font-bold text-[#0369A1]">8</p>
                <p className="text-[10px] font-display font-bold text-[#525252] uppercase">Outfits</p>
              </div>
              <div className="bg-[#D1FAE5] rounded-2xl p-4">
                <p className="font-display text-3xl font-bold text-[#047857]">20</p>
                <p className="text-[10px] font-display font-bold text-[#525252] uppercase">Logs</p>
              </div>
            </div>
            <button onClick={loadDemoData} className="btn-primary w-full !py-3.5">Load Demo Wardrobe</button>
          </>
        )}

        {status === 'loading' && (
          <div className="py-6">
            <div className="w-10 h-10 border-2 border-[#E5E5E5] border-t-[#0A0A0A] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-display font-semibold text-[#525252]">{progress}</p>
          </div>
        )}

        {status === 'done' && (
          <div className="py-4">
            <div className="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <p className="font-display font-bold text-[#0A0A0A] mb-1">Done!</p>
            <p className="text-xs text-[#A3A3A3] mb-6">{progress}</p>
            <button onClick={() => router.push('/closet')} className="btn-primary w-full !py-3.5">Go to Closet</button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4">
            <div className="bg-[#FFE0E6] rounded-2xl p-4 mb-4">
              <p className="text-sm text-[#BE123C] font-display font-bold">{progress}</p>
            </div>
            <button onClick={loadDemoData} className="btn-primary w-full !py-3.5">Try Again</button>
          </div>
        )}
      </div>
    </div>
  )
}
