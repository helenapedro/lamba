import {
  dateLabel,
  latestDaily,
  recipeOn,
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
  const todays = recipeOn(recipes, today)
  const recipe = todays ?? latestDaily(recipes, today)

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
          ? todays
            ? ` · ${dateLabel(recipe.date)}`
            : ` · from ${dateLabel(recipe.date)}`
          : ''}
      </p>
      {recipe.pairing && <p className="recipe-pairing">Pairs with: {recipe.pairing}</p>}
    </div>
  )
}
