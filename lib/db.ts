import { db } from './firebase'
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, setDoc,
} from 'firebase/firestore'

// Items
export async function getItems(userId: string, filters?: { category?: string; color?: string }) {
  let q = query(collection(db, 'users', userId, 'items'), orderBy('createdAt', 'desc'))
  if (filters?.category) q = query(collection(db, 'users', userId, 'items'), where('category', '==', filters.category), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addItem(userId: string, data: any) {
  const now = new Date().toISOString()
  const ref = await addDoc(collection(db, 'users', userId, 'items'), { ...data, timesWorn: 0, createdAt: now, updatedAt: now })
  return { id: ref.id, ...data }
}

export async function deleteItem(userId: string, itemId: string) {
  await deleteDoc(doc(db, 'users', userId, 'items', itemId))
}

// Outfits
export async function getOutfits(userId: string) {
  const snap = await getDocs(query(collection(db, 'users', userId, 'outfits'), orderBy('createdAt', 'desc')))
  const outfits = []
  for (const d of snap.docs) {
    const data = d.data()
    const items: any[] = []
    if (data.itemIds?.length) {
      for (const itemId of data.itemIds) {
        const itemDoc = await getDoc(doc(db, 'users', userId, 'items', itemId))
        if (itemDoc.exists()) items.push({ clothingItem: { id: itemDoc.id, ...itemDoc.data() } })
      }
    }
    outfits.push({ id: d.id, ...data, items })
  }
  return outfits
}

export async function addOutfit(userId: string, data: any) {
  const now = new Date().toISOString()
  const ref = await addDoc(collection(db, 'users', userId, 'outfits'), { ...data, createdAt: now, updatedAt: now })
  return { id: ref.id, ...data }
}

export async function deleteOutfit(userId: string, outfitId: string) {
  await deleteDoc(doc(db, 'users', userId, 'outfits', outfitId))
}

// Wear Logs
export async function getWearLogs(userId: string, month?: number, year?: number) {
  let q = query(collection(db, 'users', userId, 'wearLogs'), orderBy('date', 'desc'))
  if (month && year) {
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 0, 23, 59, 59).toISOString()
    q = query(collection(db, 'users', userId, 'wearLogs'), where('date', '>=', start), where('date', '<=', end), orderBy('date', 'desc'))
  }
  const snap = await getDocs(q)
  const logs = []
  for (const d of snap.docs) {
    const data = d.data()
    let outfit = null
    if (data.outfitId) {
      const outfitDoc = await getDoc(doc(db, 'users', userId, 'outfits', data.outfitId))
      if (outfitDoc.exists()) {
        const od = outfitDoc.data()
        const items: any[] = []
        if (od.itemIds?.length) {
          for (const itemId of od.itemIds) {
            const itemDoc = await getDoc(doc(db, 'users', userId, 'items', itemId))
            if (itemDoc.exists()) items.push({ clothingItem: { id: itemDoc.id, ...itemDoc.data() } })
          }
        }
        outfit = { id: outfitDoc.id, ...od, items }
      }
    }
    logs.push({ id: d.id, ...data, outfit })
  }
  return logs
}

export async function addWearLog(userId: string, data: any) {
  const now = new Date().toISOString()
  const ref = await addDoc(collection(db, 'users', userId, 'wearLogs'), { ...data, createdAt: now })
  return { id: ref.id, ...data }
}

// Analytics
export async function getAnalytics(userId: string) {
  const itemsSnap = await getDocs(query(collection(db, 'users', userId, 'items'), orderBy('timesWorn', 'desc')))
  const items = itemsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

  const logsSnap = await getDocs(query(collection(db, 'users', userId, 'wearLogs'), orderBy('date', 'desc')))
  const wearLogs = logsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

  const categoryBreakdown: Record<string, number> = {}
  items.forEach(i => { categoryBreakdown[i.category] = (categoryBreakdown[i.category] || 0) + 1 })

  const now = new Date()
  const ago = (days: number) => new Date(now.getTime() - days * 86400000)
  const notWorn = (cutoff: Date) => items.filter(i => {
    if (i.timesWorn === 0) return true
    return new Date(i.updatedAt || 0) < cutoff
  }).length

  const wearByMonth: Record<string, number> = {}
  wearLogs.forEach(l => {
    const d = new Date(l.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    wearByMonth[key] = (wearByMonth[key] || 0) + 1
  })

  return {
    totalItems: items.length,
    mostWorn: items.slice(0, 10).map(i => ({ name: i.name, timesWorn: i.timesWorn, category: i.category })),
    categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })),
    notWorn: { days30: notWorn(ago(30)), days60: notWorn(ago(60)), days90: notWorn(ago(90)) },
    wearTrend: Object.entries(wearByMonth).sort(([a], [b]) => a.localeCompare(b)).slice(-12).map(([month, count]) => ({ month, count })),
    costPerWear: items.filter(i => i.price && i.timesWorn > 0)
      .map(i => ({ name: i.name, costPerWear: Math.round((i.price / i.timesWorn) * 100) / 100, price: i.price, timesWorn: i.timesWorn }))
      .sort((a, b) => a.costPerWear - b.costPerWear).slice(0, 10),
    totalWearLogs: wearLogs.length,
  }
}

// Profile
export async function getProfile(userId: string) {
  const d = await getDoc(doc(db, 'users', userId))
  if (!d.exists()) return { id: userId, name: null, email: null, measurements: null }
  return { id: d.id, ...d.data() }
}

export async function updateProfile(userId: string, data: any) {
  await setDoc(doc(db, 'users', userId), data, { merge: true })
  return getProfile(userId)
}

// Moments
export async function getMoments(userId: string) {
  const snap = await getDocs(query(collection(db, 'users', userId, 'moments'), orderBy('date', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addMoment(userId: string, data: any) {
  const now = new Date().toISOString()
  const ref = await addDoc(collection(db, 'users', userId, 'moments'), { ...data, createdAt: now })
  return { id: ref.id, ...data }
}

// Recommendations
export function getRecommendations(items: any[], occasion?: string, temperature?: number) {
  let filtered = [...items]
  if (occasion) filtered = filtered.filter(i => i.occasions?.includes(occasion))
  if (temperature !== undefined) {
    const season = temperature < 10 ? 'winter' : temperature < 20 ? 'fall' : temperature < 28 ? 'spring' : 'summer'
    filtered = filtered.filter(i => i.seasons?.includes(season))
  }
  const byCategory: Record<string, any[]> = {}
  filtered.forEach(i => { if (!byCategory[i.category]) byCategory[i.category] = []; byCategory[i.category].push(i) })
  const outfit: any[] = []
  for (const cat of ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories']) {
    if (byCategory[cat]?.length) outfit.push(byCategory[cat][Math.floor(Math.random() * byCategory[cat].length)])
  }
  return outfit
}
