function Header() {
  return (
    <header className="mx-auto w-full max-w-4xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-400">
        Study Assistant
      </p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        Create study material
      </h1>
      <span
        aria-hidden="true"
        className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
      />
    </header>
  )
}

export default Header