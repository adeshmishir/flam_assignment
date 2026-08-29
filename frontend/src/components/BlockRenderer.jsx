import { motion } from 'framer-motion'
import { CheckCircle2, PieChart, NotebookPen } from 'lucide-react'

function CardBlock({ block }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-indigo-200/70 bg-indigo-50/50 p-5 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
          <NotebookPen className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          {block.title}
        </h4>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
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
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30">
          <PieChart className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          {block.title}
        </h4>
      </div>

      {block.subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{block.subtitle}</p>
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
              <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">
                {valueLabel(value, block.unit)}
              </span>
              <div className="flex h-28 w-full items-end overflow-hidden rounded-t-lg bg-slate-100/70 dark:bg-slate-800">
                <motion.div
                  initial={false}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 via-violet-500 to-violet-400"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="w-full truncate text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {block.labels[index]}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <span aria-hidden="true">
          Highest value: {valueLabel(top, block.unit)}
        </span>
      </div>
    </div>
  )
}

function ChecklistBlock({ block }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-5 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          {block.title}
        </h4>
      </div>

      <ul className="mt-4 space-y-2.5">
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-2.5">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 flex-none text-emerald-500"
              aria-hidden="true"
            />
            <span className="text-sm leading-snug text-slate-700 dark:text-slate-300">
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
    <div className="grid gap-5 sm:grid-cols-2">
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

        if (!node) {
          return null
        }

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
            className="min-w-0"
          >
            {node}
          </motion.div>
        )
      })}
    </div>
  )
}

export default BlockRenderer