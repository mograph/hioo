import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterBar from '@/components/FilterBar'
import PinnedCard from '@/components/PinnedCard'
import ClothingItemCard from '@/components/ClothingItemCard'
import OutfitCard from '@/components/OutfitCard'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})


describe('FilterBar', () => {
  const mockFilters = { category: '', color: '', occasion: '', season: '' }
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders all filter dropdowns', () => {
    render(<FilterBar filters={mockFilters} onChange={mockOnChange} />)
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Color')).toBeInTheDocument()
    expect(screen.getByText('Occasion')).toBeInTheDocument()
    expect(screen.getByText('Season')).toBeInTheDocument()
  })

  it('calls onChange when category is changed', () => {
    render(<FilterBar filters={mockFilters} onChange={mockOnChange} />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'tops' } })
    expect(mockOnChange).toHaveBeenCalledWith('category', 'tops')
  })

  it('calls onChange when occasion is changed', () => {
    render(<FilterBar filters={mockFilters} onChange={mockOnChange} />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[2], { target: { value: 'casual' } })
    expect(mockOnChange).toHaveBeenCalledWith('occasion', 'casual')
  })
})

describe('PinnedCard', () => {
  it('renders children', () => {
    render(<PinnedCard><div data-testid="child">Content</div></PinnedCard>)
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies rotation style', () => {
    const { container } = render(<PinnedCard rotation={2}><div>Content</div></PinnedCard>)
    const card = container.firstChild as HTMLElement
    expect(card.style.transform).toContain('rotate(2deg)')
  })

  it('renders pushpin by default', () => {
    const { container } = render(<PinnedCard><div>Content</div></PinnedCard>)
    const pushpin = container.querySelector('.pushpin')
    expect(pushpin).toBeInTheDocument()
  })

  it('renders tape when showTape is true', () => {
    const { container } = render(<PinnedCard showTape><div>Content</div></PinnedCard>)
    const tape = container.querySelector('.tape-strip')
    expect(tape).toBeInTheDocument()
  })
})

describe('ClothingItemCard', () => {
  const mockItem = {
    id: 'item-1',
    name: 'White Shirt',
    category: 'tops',
    timesWorn: 5,
    color: 'white',
    brand: 'Uniqlo',
    imageUrl: null,
  }

  it('renders item name', () => {
    render(<ClothingItemCard item={mockItem} />)
    expect(screen.getByText('White Shirt')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<ClothingItemCard item={mockItem} />)
    expect(screen.getByText('tops')).toBeInTheDocument()
  })

  it('renders times worn', () => {
    render(<ClothingItemCard item={mockItem} />)
    expect(screen.getByText('×5')).toBeInTheDocument()
  })

  it('renders brand', () => {
    render(<ClothingItemCard item={mockItem} />)
    expect(screen.getByText('Uniqlo')).toBeInTheDocument()
  })

  it('renders emoji placeholder when no image', () => {
    render(<ClothingItemCard item={mockItem} />)
    expect(screen.getByText('👕')).toBeInTheDocument()
  })

  it('calls onSelect when selectable and clicked', () => {
    const onSelect = jest.fn()
    const { container } = render(<ClothingItemCard item={mockItem} selectable onSelect={onSelect} />)
    fireEvent.click(container.firstChild as HTMLElement)
    expect(onSelect).toHaveBeenCalledWith('item-1')
  })
})

describe('OutfitCard', () => {
  const mockOutfit = {
    id: 'outfit-1',
    name: 'Monday Look',
    occasion: 'casual',
    date: '2024-03-15',
    imageUrl: null,
    items: [
      { clothingItem: { id: 'item-1', name: 'White Shirt', imageUrl: null, category: 'tops' } },
      { clothingItem: { id: 'item-2', name: 'Blue Jeans', imageUrl: null, category: 'bottoms' } },
    ],
  }

  it('renders outfit name', () => {
    render(<OutfitCard outfit={mockOutfit} />)
    expect(screen.getByText('Monday Look')).toBeInTheDocument()
  })

  it('renders piece count', () => {
    render(<OutfitCard outfit={mockOutfit} />)
    expect(screen.getByText('2 pieces')).toBeInTheDocument()
  })

  it('renders occasion tag', () => {
    render(<OutfitCard outfit={mockOutfit} />)
    expect(screen.getByText('casual')).toBeInTheDocument()
  })
})
