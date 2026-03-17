import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-faint bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/wsb-merito-logo.png"
                alt="Uniwersytety WSB Merito"
                className="h-8 brightness-0 invert"
              />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              A career platform built for WSB Merito students. Certifications,
              internships, and jobs — all in one place.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wide text-white/40">
              Platform
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/onboarding" className="text-sm text-white/60 transition-colors hover:text-white">
                  Get started
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-sm text-white/60 transition-colors hover:text-white">
                  Explore fields
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-sm text-white/60 transition-colors hover:text-white">
                  Jobs & internships
                </Link>
              </li>
            </ul>
          </div>

          {/* Fields */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wide text-white/40">
              Popular fields
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/fields/cybersecurity" className="text-sm text-white/60 transition-colors hover:text-white">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link to="/fields/cloud-engineering" className="text-sm text-white/60 transition-colors hover:text-white">
                  Cloud Engineering
                </Link>
              </li>
              <li>
                <Link to="/fields/data-science" className="text-sm text-white/60 transition-colors hover:text-white">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="/fields/devops" className="text-sm text-white/60 transition-colors hover:text-white">
                  DevOps
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wide text-white/40">
              About
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-white/60">
                  EduTech Masters 2026
                </span>
              </li>
              <li>
                <a
                  href="https://www.merito.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  WSB Merito University
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/30">
            &copy; 2026 CertPath. Built with care for WSB Merito students.
          </p>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-rust/20 px-3 py-1 font-sans text-xs tracking-wide text-rust">
              EduTech Masters 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
