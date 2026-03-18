import { useTranslation } from "react-i18next";

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const toggle = () => {
    const next = current === "pl" ? "en" : "pl";
    i18n.changeLanguage(next);
    localStorage.setItem("clairy:lang", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wide text-graphite hover:text-ink transition-colors duration-200 border border-ink/10 rounded-lg px-2.5 py-1.5 bg-white/50 hover:bg-white/80"
      aria-label="Switch language"
    >
      <span className={current === "en" ? "text-ink" : "text-pencil"}>EN</span>
      <span className="text-ink/20">/</span>
      <span className={current === "pl" ? "text-ink" : "text-pencil"}>PL</span>
    </button>
  );
}
