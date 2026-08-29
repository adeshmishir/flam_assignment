import { CheckCircle2, PieChart, NotebookPen } from 'lucide-react'

const blockSurface =
  'flex h-full flex-col rounded-xl border border-stone-200/70 bg-paper/60 p-5 dark:border-stone-700/60 dark:bg-paper-dark/60'

function CardBlock({ block }) {
  return (
    <div className={blockSurface}>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-amber-600 text-white">
          <NotebookPen className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
          {block.title}
        </h4>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        {block.body}
      </p>
    </div>
  )
}

function valueLabel(value, unit) {
  if (unit === '%') {
    return `${value}%`
  }
  if (unit) {
    return `${value} ${unit}`
  }
  return String(value)
}

function ChartBlock({ block }) {
  const max = Math.max(1, ...block.values)
  const top = Math.max(...block.values)

  return (
    <div className={blockSurface}>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-amber-600 text-white">
          <PieChart className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
          {block.title}
        </h4>
      </div>

      {block.subtitle && (
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{block.subtitle}</p>
      )}

      <div
        className="mt-6 flex h-44 items-end justify-center gap-3 sm:gap-5"
        role="img"
        aria-label={`Chart of ${block.title}: ${block.labels
          .map((label, index) => `${label} ${valueLabel(block.values[index], block.unit)}`)
          .join(', ')}`}
      >
        {block.values.map((value, index) => {
          const height = Math.max(6, Math.round((value / max) * 100))
          return (
            <div
              key={`${block.labels[index]}-${index}`}
              className="flex w-full max-w-16 flex-col items-center gap-2"
            >
              <span className="text-xs font-semibold tabular-nums text-stone-700 dark:text-stone-200">
                {valueLabel(value, block.unit)}
              </span>
              <div className="flex h-28 w-full items-end overflow-hidden rounded-t-md bg-stone-200/70 dark:bg-stone-800">
                <div
                  className="w-full rounded-t-md bg-amber-500"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="w-full truncate text-center text-[11px] font-medium text-stone-500 dark:text-stone-400">
                {block.labels[index]}
              </span>
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-xs text-stone-400 dark:text-stone-500" aria-hidden="true">
        Highest value: {valueLabel(top, block.unit)}
      </p>
    </div>
  )
}

function ChecklistBlock({ block }) {
  return (
    <div className={blockSurface}>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-amber-600 text-white">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
          {block.title}
        </h4>
      </div>

      <ul className="mt-4 space-y-2.5">
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-2.5">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 flex-none text-amber-600 dark:text-amber-500"
              aria-hidden="true"
            />
            <span className="text-sm leading-snug text-stone-700 dark:text-stone-300">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BlockRenderer({ blocks }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`
        let node = null

        if (block.type === 'card') {
          node = <CardBlock block={block} />
        } else if (block.type === 'chart') {
          node = <ChartBlock block={block} />
        } else if (block.type === 'checklist') {
          node = <ChecklistBlock block={block} />
        }

        return node ? <div key={key} className="min-w-0">{node}</div> : null
      })}
    </div>
  )
}

export default BlockRenderer