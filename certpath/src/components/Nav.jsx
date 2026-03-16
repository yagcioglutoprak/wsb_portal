import { Link, NavLink } from "react-router-dom";
import useProgress from "../hooks/useProgress";

const linkClass = ({ isActive }) =>
  [
    "font-mono text-sm uppercase tracking-wider transition-colors duration-200",
    isActive ? "text-rust" : "text-graphite hover:text-ink",
  ].join(" ");

export default function Nav() {
  const { isOnboarded } = useProgress();

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
          <span className="hidden sm:block font-serif text-2xl italic text-ink">
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
          <NavLink to="/explore" className={linkClass}>
            Explore
          </NavLink>
          <NavLink to="/jobs" className={linkClass}>
            Opportunities
          </NavLink>

          {!isOnboarded && (
            <Link
              to="/onboarding"
              className="ml-2 rounded border border-faint bg-card px-5 py-2 font-mono text-sm uppercase tracking-wider text-graphite transition-all duration-200 hover:-translate-y-px hover:border-rust hover:text-rust hover:shadow-sm"
            >
              Get Started
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
