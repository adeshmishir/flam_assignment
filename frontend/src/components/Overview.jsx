import BlockRenderer from './BlockRenderer.jsx'

function Overview({ title, summary, blocks }) {
  const hasBlocks = Array.isArray(blocks) && blocks.length > 0

  return (
    <section
      aria-label="Overview"
      className="rounded-2xl border border-stone-200/70 bg-paper/70 px-5 py-6 shadow-paper dark:border-stone-700/60 dark:bg-paper-dark/70 sm:px-7 sm:py-7"
    >
      <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-2xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 dark:text-stone-300 sm:text-base">
        {summary}
      </p>

      {hasBlocks && (
        <div className="mt-6 border-t border-stone-200/70 pt-5 dark:border-stone-700/60">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
            Key insights
          </h3>
          <div className="mt-4">
            <BlockRenderer blocks={blocks} />
          </div>
        </div>
      )}
    </section>
  )
}

export default Overview