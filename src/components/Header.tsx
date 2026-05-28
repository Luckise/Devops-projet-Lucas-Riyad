import { Link } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-md mx-auto flex items-center justify-between h-[4rem] px-4">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-white">
          EAT.
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
