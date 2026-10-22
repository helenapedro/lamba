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
  const [section, setSection] = useState('fresh')
  const groups = groupBySection(items)
  const { done, total } = progress(items)

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

      {groups.map(({ section: sec, items: sectionItems }) => (
        <div key={sec.id} className="section-block">
          <h3>{sec.label}</h3>
          <ul className="items">
            {sectionItems.map((item) => (
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
      ))}
    </section>
  )
}
