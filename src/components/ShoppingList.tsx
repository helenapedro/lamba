import { useState } from 'react'
import {
  SECTIONS,
  groupBySection,
  progress,
  type ShoppingItem,
} from '../lib/shopping'

interface Props {
  title: string
  items: ShoppingItem[]
  onToggle: (item: ShoppingItem) => void
  onAdd: (nameEn: string, section: string) => void
  onRemove: (item: ShoppingItem) => void
}

export default function ShoppingList({ title, items, onToggle, onAdd, onRemove }: Props) {
  const [name, setName] = useState('')
  // The selected chip is the active category: it filters which items are
  // shown and is where a newly added item goes.
  const [section, setSection] = useState('fresh')
  const groups = groupBySection(items)
  const { done, total } = progress(items)
  const activeGroup = groups.find((g) => g.section.id === section)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name, section)
    setName('')
  }

  return (
    <section className="shopping">
      <h2>Shopping list: {title}</h2>
      <p className="progress">
        {done} of {total} done
      </p>

      <form className="add-form" onSubmit={submit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add item (English name)"
          aria-label="Item name"
        />
        <div className="section-chips" role="radiogroup" aria-label="Section">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={section === s.id}
              className={section === s.id ? 'chip active' : 'chip'}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button type="submit">Add</button>
      </form>

      {!activeGroup ? (
        <p className="empty-section">
          No items in this category yet. Add one above.
        </p>
      ) : (
        <div className="section-block">
          <h3>{activeGroup.section.label}</h3>
          <ul className="items">
            {activeGroup.items.map((item) => (
              <li key={item.id} className={item.checked ? 'item checked' : 'item'}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => onToggle(item)}
                  />
                  <span className="item-main">
                    <span className="item-name">{item.nameEn}</span>
                    {(item.brand || item.quantity || item.namePt) && (
                      <span className="item-sub">
                        {[item.brand, item.quantity, item.namePt]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    )}
                    {item.notes && <span className="item-note">{item.notes}</span>}
                  </span>
                </label>
                <button
                  className="remove"
                  onClick={() => onRemove(item)}
                  aria-label={`Remove ${item.nameEn}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
