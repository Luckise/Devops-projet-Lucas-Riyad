import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
      <div className="max-w-md mx-auto flex items-center justify-center h-[4rem] px-4">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-black dark:text-white">
          EAT.
        </Link>
      </div>
    </header>
  );
}
