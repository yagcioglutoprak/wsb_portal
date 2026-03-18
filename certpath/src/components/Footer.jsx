import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">

          {/* Logo */}
          <div className="lg:col-span-4">
            <Link to="/" className="font-serif text-[32px] font-bold tracking-tight text-white flex items-center gap-3 leading-none">
              Clairy
            </Link>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">

            {/* Column 1 */}
            <div>
              <h4 className="font-sans text-[15px] text-white/50 mb-5">
                {t("footer.platform")}
              </h4>
              <ul className="space-y-4">
                <li><Link to="/lessons" className="text-[15px] text-white hover:text-white/80 transition-colors">{t("footer.lessons")}</Link></li>
                <li><Link to="/explore" className="text-[15px] text-white hover:text-white/80 transition-colors">{t("footer.certifications")}</Link></li>
                <li><Link to="/jobs" className="text-[15px] text-white hover:text-white/80 transition-colors">{t("footer.jobsInternships")}</Link></li>
                <li><Link to="/dashboard" className="text-[15px] text-white hover:text-white/80 transition-colors">{t("footer.dashboard")}</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-sans text-[15px] text-white/50 mb-5">
                {t("footer.university")}
              </h4>
              <ul className="space-y-4">
                <li><a href="https://www.merito.pl" target="_blank" rel="noopener noreferrer" className="text-[15px] text-white hover:text-white/80 transition-colors">{t("footer.wsbMerito")}</a></li>
                <li><a href="https://www.merito.pl/warszawa" target="_blank" rel="noopener noreferrer" className="text-[15px] text-white hover:text-white/80 transition-colors">{t("footer.campusWarsaw")}</a></li>
                <li><a href="https://www.meritogroup.pl" target="_blank" rel="noopener noreferrer" className="text-[15px] text-white hover:text-white/80 transition-colors">{t("footer.grupaMerito")}</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-sans text-[15px] text-white/50 mb-5">
                {t("footer.resources")}
              </h4>
              <ul className="space-y-4">
                <li><a href="mailto:centruminnowacji@warszawa.merito.pl" className="text-[15px] text-white hover:text-white/80 transition-colors">{t("footer.contactUs")}</a></li>
                <li><a href="mailto:centruminnowacji@warszawa.merito.pl" className="text-[15px] text-white hover:text-white/80 transition-colors">{t("footer.feedback")}</a></li>
              </ul>
            </div>

          </div>

          {/* Socials */}
          <div className="lg:col-span-2 flex justify-start lg:justify-end gap-6 items-start">
            <a href="https://www.facebook.com/UniwersytetWSBMerito" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
            </a>
            <a href="https://www.instagram.com/wsb_merito/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://x.com/WSBMerito" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
            </a>
            <a href="https://www.linkedin.com/school/uniwersytet-wsb-merito/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.475-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-28 pt-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pb-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/terms" className="text-[13px] text-white/50 hover:text-white transition-colors">{t("footer.terms")}</Link>
            <Link to="/privacy" className="text-[13px] text-white/50 hover:text-white transition-colors">{t("footer.privacy")}</Link>
          </div>
          <div className="text-[13px] text-white/50">
            {t("footer.copyright")}
          </div>
        </div>
      </div>
    </footer>
  );
}
