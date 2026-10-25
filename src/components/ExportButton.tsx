// Export button: downloads the whole household dataset as one JSON file
// (lamba-export-YYYY-MM-DD.json), for Helena to send to the assistant for
// reconciliation with the chat records. Works on the live data in App and
// on the in-memory preview data alike.
import { todayStr, type Recipe } from '../lib/recipes'
import { buildExportData } from '../lib/exportData'
import type { ShoppingItem } from '../lib/shopping'
import type { Product } from '../lib/products'
import type { InventoryItem } from '../lib/inventory'

interface Props {
  shoppingTitle: string
  shoppingItems: ShoppingItem[]
  recipes: Recipe[]
  products: Product[]
  inventory: InventoryItem[]
}

export default function ExportButton(props: Props) {
  function handleExport() {
    const data = buildExportData(props)
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lamba-export-${todayStr()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button type="button" onClick={handleExport}>
      Export data (JSON)
    </button>
  )
}
