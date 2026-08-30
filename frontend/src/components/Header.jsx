import LogoMark from './LogoMark.jsx'

function Header() {
  return (
    <header className="mx-auto w-full max-w-4xl px-1 text-center">
      <div className="flex justify-center">
        <LogoMark />
      </div>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
        Study<span className="text-amber-600 dark:text-amber-400">Mate</span>
      </h1>
      <span
        aria-hidden="true"
        className="mx-auto mt-4 block h-[3px] w-14 rounded-full bg-gradient-to-r from-transparent via-amber-600/70 to-transparent"
      />
    </header>
  )
}

export default Header