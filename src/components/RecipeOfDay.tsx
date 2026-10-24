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
}

// The daily recipe card: today's suggested recipe when one is set for
// today, otherwise the most recent daily recipe, labeled with its date.
export default function RecipeOfDay({ recipes }: Props) {
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
      <p className="recipe-title">{recipe.title}</p>
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
