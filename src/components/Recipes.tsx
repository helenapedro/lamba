import { useState, type FormEvent } from 'react'
import {
  MEAL_SLOTS,
  dateLabel,
  favoriteRecipes,
  recipesInSlot,
  slotLabel,
  type NewRecipe,
  type Recipe,
} from '../lib/recipes'

interface Props {
  recipes: Recipe[]
  onAdd: (recipe: NewRecipe) => void
  onRemove: (recipe: Recipe) => void
  onToggleFavorite: (recipe: Recipe, favorite: boolean) => void
}

export default function Recipes({ recipes, onAdd, onRemove, onToggleFavorite }: Props) {
  const [title, setTitle] = useState('')
  const [slot, setSlot] = useState('dinner')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [pairing, setPairing] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      mealSlot: slot,
      pairing: pairing.trim() || undefined,
      servings: 2,
      ingredients: ingredients
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
      steps: steps.trim(),
    })
    setTitle('')
    setPairing('')
    setIngredients('')
    setSteps('')
  }

  const visible = favoritesOnly
    ? favoriteRecipes(recipes)
    : recipesInSlot(recipes, slot)

  return (
    <section className="card">
      <h2>Recipes</h2>

      <div className="section-chips">
        <button
          type="button"
          aria-pressed={favoritesOnly}
          className={favoritesOnly ? 'chip active' : 'chip'}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
        >
          ★ Favorites
        </button>
      </div>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <input
          aria-label="Recipe title"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="section-chips" role="radiogroup" aria-label="Meal">
          {MEAL_SLOTS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={slot === s.id}
              className={slot === s.id ? 'chip active' : 'chip'}
              onClick={() => setSlot(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input
          aria-label="Pairing"
          placeholder="Pairs with (optional)"
          value={pairing}
          onChange={(e) => setPairing(e.target.value)}
        />
        <textarea
          aria-label="Ingredients"
          placeholder="Ingredients, one per line"
          rows={4}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <textarea
          aria-label="Steps"
          placeholder="How to make it"
          rows={3}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
        <button type="submit">Add recipe</button>
      </form>

      {visible.length === 0 ? (
        <p className="empty-section">
          {favoritesOnly
            ? 'No favorite recipes yet.'
            : 'No recipes in this category yet.'}
        </p>
      ) : (
        <ul className="items">
          {visible.map((recipe) => {
          const expanded = expandedId === recipe.id
          return (
            <li key={recipe.id} className="recipe-item">
              <div className="recipe-head">
                <button
                  type="button"
                  className="recipe-toggle"
                  aria-expanded={expanded}
                  onClick={() => setExpandedId(expanded ? null : recipe.id)}
                >
                  <span className="item-name">{recipe.title}</span>
                  <span className="item-sub">
                    {slotLabel(recipe.mealSlot)}
                    {recipe.date ? ` · ${dateLabel(recipe.date)}` : ''}
                  </span>
                </button>
                <button
                  type="button"
                  className={recipe.favorite ? 'favorite-button active' : 'favorite-button'}
                  aria-label={`Toggle favorite for ${recipe.title}`}
                  aria-pressed={!!recipe.favorite}
                  onClick={() => onToggleFavorite(recipe, !recipe.favorite)}
                >
                  {recipe.favorite ? '★' : '☆'}
                </button>
                <button
                  className="remove"
                  onClick={() => onRemove(recipe)}
                  aria-label={`Remove ${recipe.title}`}
                >
                  ×
                </button>
              </div>
              {recipe.pairing && (
                <p className="recipe-pairing">Pairs with: {recipe.pairing}</p>
              )}
              {expanded && (
                <div className="recipe-details">
                  {recipe.why && <p className="recipe-why">{recipe.why}</p>}
                  {recipe.ingredients.length > 0 && (
                    <>
                      <h4>Ingredients</h4>
                      <ul>
                        {recipe.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {recipe.steps && (
                    <>
                      <h4>Method</h4>
                      <p>{recipe.steps}</p>
                    </>
                  )}
                  {recipe.substitutions && (
                    <p className="item-note">Substitutions: {recipe.substitutions}</p>
                  )}
                  {recipe.sourceUrl && (
                    <p>
                      <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                        Source
                      </a>
                    </p>
                  )}
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
