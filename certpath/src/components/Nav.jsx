import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  [
    "font-mono text-xs uppercase tracking-wider transition-colors duration-200",
    isActive ? "text-rust" : "text-graphite hover:text-ink",
  ].join(" ");

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-faint bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-baseline gap-0">
          <span className="font-serif text-2xl italic text-ink">
            <span className="text-rust">C</span>ert
            <span className="text-rust">P</span>ath
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-6 sm:gap-8">
          <NavLink to="/" end className={linkClass}>
            Fields
          </NavLink>
          <NavLink to="/jobs" className={linkClass}>
            Jobs
          </NavLink>

          <button
            type="button"
            className="ml-2 rounded border border-faint bg-white px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-graphite transition-all duration-200 hover:-translate-y-px hover:border-rust hover:text-rust hover:shadow-sm"
          >
            Sign in
          </button>
        </nav>
      </div>
    </header>
  );
}
