import { useState } from 'react'
import { slotLabel, type PublicRecipe } from '../lib/recipes'
import { matchesQuery } from '../lib/search'

interface Props {
  publicRecipes: PublicRecipe[]
  /** Titles already in the signed-in user's own recipes. */
  savedTitles: string[]
  onSaveCopy: (recipe: PublicRecipe) => void
  query?: string
}

// Recipes other signed-in users chose to share. Read-only here: the
// only action is saving a private copy into your own recipes.
export default function PublicRecipes({
  publicRecipes,
  savedTitles,
  onSaveCopy,
  query = '',
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const visible = [...publicRecipes]
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter((r) =>
      matchesQuery(query, [r.title, r.authorName, ...r.ingredients]),
    )

  return (
    <section className="card">
      <h2>Public recipes</h2>
      <p className="profile-note">
        Recipes shared by other Lamba users. Save a copy to keep one in
        your own recipes.
      </p>
      {visible.length === 0 ? (
        <p className="empty-section">
          {query.trim()
            ? 'No public recipes match your search.'
            : 'No public recipes yet.'}
        </p>
      ) : (
        <ul className="items">
          {visible.map((recipe) => {
            const expanded = expandedId === recipe.id
            const saved = savedTitles.includes(recipe.title)
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
                      {slotLabel(recipe.mealSlot)} · by {recipe.authorName}
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={saved}
                    onClick={() => onSaveCopy(recipe)}
                    aria-label={
                      saved
                        ? `${recipe.title} is already in your recipes`
                        : `Save a copy of ${recipe.title}`
                    }
                  >
                    {saved ? 'Saved' : 'Save a copy'}
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
                      <p className="item-note">
                        Substitutions: {recipe.substitutions}
                      </p>
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
