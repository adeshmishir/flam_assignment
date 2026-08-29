import { motion } from 'framer-motion'
import { Loader2, Send, Sparkles } from 'lucide-react'

function GenerateButton({ onClick, disabled, isLoading }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 transition-[background-position] duration-500 hover:bg-[position:100%_0] hover:shadow-xl hover:shadow-indigo-600/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-none disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-slate-700 dark:disabled:text-slate-500 sm:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 text-indigo-200 transition group-hover:rotate-6 group-hover:scale-110" aria-hidden="true" />
          Generate Study Material
          <Send className="h-4 w-4 text-indigo-200 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </>
      )}
    </motion.button>
  )
}

export default GenerateButton