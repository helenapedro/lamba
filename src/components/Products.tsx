import { useState, type FormEvent } from 'react'
import { SECTIONS } from '../lib/shopping'
import {
  VERDICTS,
  productsInCategory,
  verdictLabel,
  type NewProduct,
  type Product,
  type Verdict,
} from '../lib/products'
import { matchesQuery } from '../lib/search'

interface Props {
  products: Product[]
  onAdd: (product: NewProduct) => void
  onUpdateBrand: (product: Product, brand: string) => void
  onRemove: (product: Product) => void
  query?: string
}

// The product registry: which brand Helena buys for each product, and the
// verdict from her analyses. No photos, by her decision. The category
// chips filter the list, like the shopping list, and a new product goes
// into the selected category.
export default function Products({
  products,
  onAdd,
  onUpdateBrand,
  onRemove,
  query = '',
}: Props) {
  const [category, setCategory] = useState('base')
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [verdict, setVerdict] = useState<Verdict | ''>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [brandDraft, setBrandDraft] = useState('')

  const visible = productsInCategory(products, category).filter((p) =>
    matchesQuery(query, [p.nameEn, p.namePt, p.brand]),
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      nameEn: name.trim(),
      brand: brand.trim() || undefined,
      category,
      verdict: verdict || undefined,
    })
    setName('')
    setBrand('')
    setVerdict('')
  }

  function toggleExpand(product: Product) {
    if (expandedId === product.id) {
      setExpandedId(null)
    } else {
      setExpandedId(product.id)
      setBrandDraft(product.brand ?? '')
    }
  }

  return (
    <section className="card">
      <h2>Products</h2>
      <p className="recipe-meta">The brand you buy for each product.</p>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <input
          aria-label="Product name"
          placeholder="Product (English name)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Brand"
          placeholder="Brand you buy"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <div className="section-chips" role="radiogroup" aria-label="Category">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={category === s.id}
              className={category === s.id ? 'chip active' : 'chip'}
              onClick={() => setCategory(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="section-chips" role="radiogroup" aria-label="Verdict">
          {VERDICTS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={verdict === v.id}
              className={verdict === v.id ? 'chip active' : 'chip'}
              onClick={() => setVerdict(verdict === v.id ? '' : v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button type="submit">Add product</button>
      </form>

      {visible.length === 0 ? (
        <p className="empty-section">
          {query.trim()
            ? 'No products match your search.'
            : 'No products in this category yet.'}
        </p>
      ) : (
        <ul className="items">
          {visible.map((product) => {
            const expanded = expandedId === product.id
            return (
              <li key={product.id} className="recipe-item">
                <div className="recipe-head">
                  <button
                    type="button"
                    className="recipe-toggle"
                    aria-expanded={expanded}
                    onClick={() => toggleExpand(product)}
                  >
                    <span className="item-name">{product.nameEn}</span>
                    <span className="item-sub">
                      {product.brand ?? 'No brand set yet'}
                      {product.namePt ? ` · ${product.namePt}` : ''}
                    </span>
                  </button>
                  {product.verdict && (
                    <span className={`verdict verdict-${product.verdict}`}>
                      {verdictLabel(product.verdict)}
                    </span>
                  )}
                  <button
                    className="remove"
                    onClick={() => onRemove(product)}
                    aria-label={`Remove ${product.nameEn}`}
                  >
                    ×
                  </button>
                </div>
                {expanded && (
                  <div className="recipe-details">
                    <label className="brand-edit">
                      <span>Brand you buy</span>
                      <input
                        aria-label={`Brand for ${product.nameEn}`}
                        value={brandDraft}
                        onChange={(e) => setBrandDraft(e.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => onUpdateBrand(product, brandDraft)}
                    >
                      Save brand
                    </button>
                    {product.store && <p className="item-note">Store: {product.store}</p>}
                    {product.notes && <p className="item-note">{product.notes}</p>}
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
