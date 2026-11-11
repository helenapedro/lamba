import {
  dateLabel,
  dayRecipe,
  slotLabel,
  todayStr,
  type Recipe,
} from '../lib/recipes'

interface Props {
  recipes: Recipe[]
  onToggleFavorite: (recipe: Recipe, favorite: boolean) => void
}

// The daily recipe card: today's suggested recipe when one is set for
// today, otherwise the most recent daily recipe, labeled with its date.
// The star marks it as a favorite, shared with the Recipes list.
export default function RecipeOfDay({ recipes, onToggleFavorite }: Props) {
  const today = todayStr()
  const { recipe, isToday } = dayRecipe(recipes, today)

  if (!recipe) {
    return (
      <div className="card">
        <h2>Recipe of the day</h2>
        <p>Coming soon: the daily recipe will appear here.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Recipe of the day</h2>
      <div className="recipe-head">
        <p className="recipe-title">{recipe.title}</p>
        <button
          type="button"
          className={recipe.favorite ? 'favorite-button active' : 'favorite-button'}
          aria-label={`Toggle favorite for ${recipe.title}`}
          aria-pressed={!!recipe.favorite}
          onClick={() => onToggleFavorite(recipe, !recipe.favorite)}
        >
          {recipe.favorite ? '★' : '☆'}
        </button>
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
    </div>
  )
}
