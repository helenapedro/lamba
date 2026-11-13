import { dateLabel, slotLabel, type Recipe } from '../lib/recipes'

interface Props {
  /** The shared daily recipe (today's, or the most recent one). */
  daily: Recipe | undefined
  isToday: boolean
  /** The user's own saved copy of this title, if they kept it. */
  savedCopy: Recipe | undefined
  /** Favorites the saved copy only; the shared doc is never written. */
  onToggleFavorite: (recipe: Recipe, favorite: boolean) => void
  onSaveDaily: (recipe: Recipe) => void
}

// The daily recipe card: today's shared suggestion when one is set for
// today, otherwise the most recent daily recipe, labeled with its date.
// "Save recipe" keeps a private copy in the user's own recipes; without
// it, the suggestion stays only on this card. The star only appears
// once the recipe is saved, because it favorites the saved copy, never
// the shared document.
export default function RecipeOfDay({
  daily,
  isToday,
  savedCopy,
  onToggleFavorite,
  onSaveDaily,
}: Props) {
  if (!daily) {
    return (
      <div className="card">
        <h2>Recipe of the day</h2>
        <p>Coming soon: the daily recipe will appear here.</p>
      </div>
    )
  }

  const recipe = daily
  const saved = savedCopy !== undefined

  return (
    <div className="card">
      <h2>Recipe of the day</h2>
      <div className="recipe-head">
        <p className="recipe-title">{recipe.title}</p>
        {savedCopy && (
          <button
            type="button"
            className={
              savedCopy.favorite ? 'favorite-button active' : 'favorite-button'
            }
            aria-label={`Toggle favorite for ${recipe.title}`}
            aria-pressed={!!savedCopy.favorite}
            onClick={() => onToggleFavorite(savedCopy, !savedCopy.favorite)}
          >
            {savedCopy.favorite ? '★' : '☆'}
          </button>
        )}
      </div>
      <p className="recipe-meta">
        {slotLabel(recipe.mealSlot)} · for {recipe.servings}
        {recipe.date
          ? isToday
            ? ` · ${dateLabel(recipe.date)}`
            : ` · from ${dateLabel(recipe.date)}`
          : ''}
      </p>
      {recipe.pairing && <p className="recipe-pairing">Pairs with: {recipe.pairing}</p>}
      {recipe.why && <p className="recipe-why">{recipe.why}</p>}
      {(recipe.ingredients.length > 0 || recipe.steps) && (
        <div className="recipe-details">
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
        </div>
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
      <div className="button-row">
        <button
          type="button"
          disabled={saved}
          onClick={() => onSaveDaily(recipe)}
          aria-label={
            saved
              ? `${recipe.title} is already in your recipes`
              : `Save ${recipe.title} to your recipes`
          }
        >
          {saved ? 'Saved' : 'Save recipe'}
        </button>
      </div>
    </div>
  )
}
