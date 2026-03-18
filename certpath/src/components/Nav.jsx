import { Link, NavLink } from "react-router-dom";
import useProgress from "../hooks/useProgress";

const linkClass = ({ isActive }) =>
  [
    "font-sans text-sm tracking-wide transition-colors duration-200",
    isActive ? "text-rust" : "text-graphite hover:text-ink",
  ].join(" ");

export default function Nav() {
  const { isOnboarded, xp, level } = useProgress();

  return (
    <header className="sticky top-0 z-50 border-b border-faint bg-paper/90 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/wsb-merito-logo.png"
            alt="Uniwersytety WSB Merito"
            className="h-9"
          />
          <span className="hidden sm:block h-6 w-px bg-faint" />
          <span className="hidden sm:block font-serif text-2xl text-ink">
            <span className="text-rust">C</span>ert<span className="text-rust">P</span>ath
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-6 sm:gap-8">
          {isOnboarded && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}
          <NavLink to="/lessons" className={linkClass}>
            Lessons
          </NavLink>
          <NavLink to="/explore" className={linkClass}>
            Explore
          </NavLink>
          <NavLink to="/certificates" className={linkClass}>
            Certificates
          </NavLink>
          <NavLink to="/jobs" className={linkClass}>
            Opportunities
          </NavLink>

          {isOnboarded && (
            <span className="font-sans text-xs font-semibold text-arcade border border-arcade/20 bg-arcade/5 rounded-full px-3 py-1.5">
              Lvl {level} · {xp} xp
            </span>
          )}

          {!isOnboarded && (
            <Link
              to="/onboarding"
              className="ml-2 bg-rust text-white rounded-xl px-6 py-2.5 font-sans text-sm font-semibold hover:bg-rust/90 transition-all duration-200"
            >
              Get Started
            </Link>
          )}

          {/* Dev: clear localStorage */}
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="ml-2 text-xs text-pencil/50 hover:text-red-500 transition-colors"
              title="Clear localStorage (dev only)"
            >
              Reset
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
