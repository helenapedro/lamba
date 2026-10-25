import { useState, type FormEvent } from 'react'
import {
  LOCATIONS,
  formatQuantity,
  itemsInLocation,
  quantityStep,
  type InventoryItem,
  type Location,
  type NewInventoryItem,
} from '../lib/inventory'
import { dateLabel } from '../lib/recipes'

interface Props {
  items: InventoryItem[]
  onAdd: (item: NewInventoryItem) => void
  onUpdateQuantity: (item: InventoryItem, quantity: number) => void
  onRemove: (item: InventoryItem) => void
  onAddToShopping: (item: InventoryItem) => void
}

// Home inventory: what Helena has at home, by location, with a quantity
// she bumps up and down. The location chips filter the list, like the
// shopping list, and a new item goes into the selected location. An item
// at zero offers to go back on the shopping list.
export default function Inventory({
  items,
  onAdd,
  onUpdateQuantity,
  onRemove,
  onAddToShopping,
}: Props) {
  const [location, setLocation] = useState<Location>('pantry')
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const visible = itemsInLocation(items, location)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const qty = Number(quantity)
    onAdd({
      nameEn: name.trim(),
      quantity: Number.isFinite(qty) && qty > 0 ? qty : 1,
      unit: unit.trim() || 'un',
      location,
      expiresAt: expiresAt || undefined,
    })
    setName('')
    setQuantity('1')
    setUnit('')
    setExpiresAt('')
  }

  return (
    <section className="card">
      <h2>At home</h2>
      <p className="recipe-meta">
        What you have at home, by location. Quantities marked as estimates in
        the notes are for you to correct.
      </p>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <input
          aria-label="Item name"
          placeholder="Item (English name)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Quantity"
          placeholder="Quantity"
          type="number"
          min="0"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          aria-label="Unit"
          placeholder="Unit (un, lb, bags, packs...)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <label className="field-label">
          <span>Expiry date (optional)</span>
          <input
            aria-label="Expiry date (optional)"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </label>
        <div className="section-chips" role="radiogroup" aria-label="Location">
          {LOCATIONS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={location === l.id}
              className={location === l.id ? 'chip active' : 'chip'}
              onClick={() => setLocation(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button type="submit">Add item</button>
      </form>

      {visible.length === 0 ? (
        <p className="empty-section">No items in this location yet.</p>
      ) : (
        <ul className="items">
          {visible.map((item) => {
            const expanded = expandedId === item.id
            const step = quantityStep(item.unit)
            return (
              <li key={item.id} className="recipe-item">
                <div className="recipe-head">
                  <button
                    type="button"
                    className="recipe-toggle"
                    aria-expanded={expanded}
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                  >
                    <span className="item-name">{item.nameEn}</span>
                    <span className="item-sub">
                      {formatQuantity(item.quantity, item.unit)}
                      {item.namePt ? ` · ${item.namePt}` : ''}
                      {item.expiresAt ? ` · expires ${dateLabel(item.expiresAt)}` : ''}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="qty-button"
                    aria-label={`Decrease ${item.nameEn}`}
                    onClick={() => onUpdateQuantity(item, item.quantity - step)}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="qty-button"
                    aria-label={`Increase ${item.nameEn}`}
                    onClick={() => onUpdateQuantity(item, item.quantity + step)}
                  >
                    +
                  </button>
                  {item.quantity <= 0 && (
                    <button
                      type="button"
                      className="qty-button"
                      aria-label={`Add ${item.nameEn} to shopping list`}
                      onClick={() => onAddToShopping(item)}
                    >
                      Add to list
                    </button>
                  )}
                  <button
                    className="remove"
                    onClick={() => onRemove(item)}
                    aria-label={`Remove ${item.nameEn}`}
                  >
                    ×
                  </button>
                </div>
                {expanded && item.notes && (
                  <div className="recipe-details">
                    <p className="item-note">{item.notes}</p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
