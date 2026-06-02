import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const Header = memo(function Header() {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("eat_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="fixed top-0 w-full z-50" style={{ backgroundColor: "var(--header-bg)" }}>
      <div className="max-w-md mx-auto flex items-center justify-between h-[4rem] px-4">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tighter" style={{ color: "var(--charcoal)" }}>
          EAT.
        </Link>
        <button
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
});

export default Header;
