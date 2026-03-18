import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useProgress from "../hooks/useProgress";
import { useAuth } from "../contexts/AuthContext";
import LangSwitcher from "./LangSwitcher";

const linkClass = ({ isActive }) =>
  [
    "font-sans text-sm tracking-wide transition-colors duration-200",
    isActive ? "text-rust" : "text-graphite hover:text-ink",
  ].join(" ");

const mobileLinkClass = ({ isActive }) =>
  [
    "block w-full font-sans text-lg font-medium tracking-wide py-3 px-2 rounded-lg transition-colors duration-200",
    isActive
      ? "text-rust bg-rust/5"
      : "text-graphite hover:text-ink hover:bg-ink/5",
  ].join(" ");

function UserAvatar({ email, onClick }) {
  const letter = email ? email.charAt(0).toUpperCase() : "?";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-rust text-white font-sans text-sm font-semibold hover:bg-rust/90 transition-colors duration-200"
      aria-label="Account menu"
    >
      {letter}
    </button>
  );
}

export default function Nav() {
  const { t } = useTranslation();
  const { isOnboarded, xp, level } = useProgress();
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { pathname } = useLocation();

  const closeMenu = () => setMenuOpen(false);

  // Close menu automatically on route change
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Close account dropdown when clicking outside
  useEffect(() => {
    if (!accountOpen) return;
    function handleClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [accountOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-faint bg-paper/90 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4" onClick={closeMenu}>
          <img
            src="/wsb-merito-logo.png"
            alt="Uniwersytety WSB Merito"
            className="h-9"
          />
          <span className="hidden sm:block h-6 w-px bg-faint" />
          <span className="hidden sm:block font-serif text-2xl text-ink">
            <span className="text-rust">C</span>lairy
          </span>
        </Link>

        {/* Desktop navigation links */}
        <nav className="hidden md:flex items-center gap-6 sm:gap-8">
          {isOnboarded && (
            <NavLink to="/dashboard" className={linkClass}>
              {t("nav.dashboard")}
            </NavLink>
          )}
          <NavLink to="/lessons" className={linkClass}>
            {t("nav.lessons")}
          </NavLink>
          <NavLink to="/explore" className={linkClass}>
            {t("nav.explore")}
          </NavLink>
          <NavLink to="/certificates" className={linkClass}>
            {t("nav.certificates")}
          </NavLink>
          <NavLink to="/jobs" className={linkClass}>
            {t("nav.opportunities")}
          </NavLink>

          {isOnboarded && (
            <span className="font-sans text-xs font-semibold text-arcade border border-arcade/20 bg-arcade/5 rounded-full px-3 py-1.5">
              Lvl {level} · {xp} xp
            </span>
          )}

          {!isOnboarded && !user && (
            <Link
              to="/onboarding"
              className="ml-2 bg-rust text-white rounded-xl px-6 py-2.5 font-sans text-sm font-semibold hover:bg-rust/90 transition-all duration-200"
            >
              {t("nav.getStarted")}
            </Link>
          )}

          {/* Auth: Sign in / Account dropdown */}
          {!authLoading && !user && (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="font-sans text-sm tracking-wide text-graphite hover:text-ink transition-colors duration-200"
            >
              {t("nav.signIn")}
            </button>
          )}

          {!authLoading && user && (
            <div className="relative" ref={accountRef}>
              <UserAvatar
                email={user.email}
                onClick={() => setAccountOpen((prev) => !prev)}
              />
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-paper border border-faint rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-faint">
                    <p className="font-sans text-xs text-graphite truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2.5 font-sans text-sm text-graphite hover:text-ink hover:bg-ink/5 transition-colors duration-200"
                  >
                    {t("nav.signOut")}
                  </button>
                </div>
              )}
            </div>
          )}

          <LangSwitcher />

          {/* Dev: clear localStorage */}
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="ml-2 text-xs text-pencil/50 hover:text-red-500 transition-colors"
              title="Clear localStorage (dev only)"
            >
              {t("nav.reset")}
            </button>
          )}
        </nav>

        {/* Mobile: XP badge + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {isOnboarded && (
            <span className="font-sans text-xs font-semibold text-arcade border border-arcade/20 bg-arcade/5 rounded-full px-2.5 py-1">
              Lvl {level}
            </span>
          )}

          {/* Hamburger button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative flex items-center justify-center w-11 h-11 rounded-lg text-ink hover:bg-ink/5 transition-colors duration-200"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[73px] z-40 bg-ink/20 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Slide-down panel */}
          <nav
            className="absolute left-0 right-0 top-full z-50 bg-paper border-b border-faint shadow-lg md:hidden animate-slide-up"
          >
            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex flex-col gap-1">
              {isOnboarded && (
                <NavLink to="/dashboard" className={mobileLinkClass} onClick={closeMenu}>
                  {t("nav.dashboard")}
                </NavLink>
              )}
              <NavLink to="/lessons" className={mobileLinkClass} onClick={closeMenu}>
                {t("nav.lessons")}
              </NavLink>
              <NavLink to="/explore" className={mobileLinkClass} onClick={closeMenu}>
                {t("nav.explore")}
              </NavLink>
              <NavLink to="/certificates" className={mobileLinkClass} onClick={closeMenu}>
                {t("nav.certificates")}
              </NavLink>
              <NavLink to="/jobs" className={mobileLinkClass} onClick={closeMenu}>
                {t("nav.opportunities")}
              </NavLink>

              <LangSwitcher />

              {/* Divider */}
              <div className="my-2 h-px bg-faint" />

              {isOnboarded && (
                <div className="flex items-center gap-2 px-2 py-2">
                  <span className="font-sans text-xs font-semibold text-arcade border border-arcade/20 bg-arcade/5 rounded-full px-3 py-1.5">
                    Lvl {level} · {xp} xp
                  </span>
                </div>
              )}

              {!isOnboarded && !user && (
                <Link
                  to="/onboarding"
                  className="mt-2 block text-center bg-rust text-white rounded-xl px-6 py-3 font-sans text-sm font-semibold hover:bg-rust/90 transition-all duration-200"
                  onClick={closeMenu}
                >
                  {t("nav.getStarted")}
                </Link>
              )}

              {/* Auth section in mobile menu */}
              {!authLoading && !user && (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    signInWithGoogle();
                  }}
                  className="block w-full font-sans text-lg font-medium tracking-wide py-3 px-2 rounded-lg text-graphite hover:text-ink hover:bg-ink/5 transition-colors duration-200 text-left"
                >
                  {t("nav.signIn")}
                </button>
              )}

              {!authLoading && user && (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rust text-white font-sans text-sm font-semibold shrink-0">
                      {user.email ? user.email.charAt(0).toUpperCase() : "?"}
                    </div>
                    <span className="font-sans text-sm text-graphite truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      signOut();
                    }}
                    className="block w-full font-sans text-lg font-medium tracking-wide py-3 px-2 rounded-lg text-graphite hover:text-ink hover:bg-ink/5 transition-colors duration-200 text-left"
                  >
                    {t("nav.signOut")}
                  </button>
                </>
              )}

              {/* Dev: clear localStorage */}
              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="mt-1 text-xs text-pencil/50 hover:text-red-500 transition-colors text-left px-2 py-2"
                  title="Clear localStorage (dev only)"
                >
                  {t("nav.resetLocalStorage")}
                </button>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
