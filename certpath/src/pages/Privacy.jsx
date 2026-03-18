import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-1 text-sm text-pencil">Last updated: March 18, 2026</p>
      </div>

      <section className="space-y-4 text-[15px] text-graphite leading-relaxed">
        <h2 className="text-lg font-bold text-ink">1. Introduction</h2>
        <p>
          Clairy ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, store, and protect your personal data when you use our
          platform, in accordance with the General Data Protection Regulation (GDPR) — Regulation
          (EU) 2016/679 — and Polish data protection law.
        </p>

        <h2 className="text-lg font-bold text-ink">2. Data Controller</h2>
        <p>
          The data controller responsible for your personal data is the Clairy team,
          operating under the auspices of WSB Merito University's Innovation Center
          (Centrum Innowacji), ul. Powstańców Wielkopolskich 5, 61-895 Poznań, Poland.
        </p>
        <p>
          Contact: <a href="mailto:centruminnowacji@warszawa.merito.pl" className="text-rust hover:underline">centruminnowacji@warszawa.merito.pl</a>
        </p>

        <h2 className="text-lg font-bold text-ink">3. What Data We Collect</h2>

        <h3 className="font-semibold text-ink">3.1 Data you provide directly</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Onboarding profile:</strong> University year, academic program, career field interest</li>
          <li><strong>Account data (when available):</strong> Name, email address, university affiliation</li>
        </ul>

        <h3 className="font-semibold text-ink">3.2 Data generated through usage</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Learning progress:</strong> Completed lessons, steps, XP earned, skill levels</li>
          <li><strong>Engagement data:</strong> Daily streak information, session frequency</li>
          <li><strong>Platform interaction:</strong> Pages visited, features used, lesson completion rates</li>
        </ul>

        <h3 className="font-semibold text-ink">3.3 Technical data</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Browser type and version</li>
          <li>Device type (desktop, mobile, tablet)</li>
          <li>IP address (anonymized where possible)</li>
          <li>Cookies and local storage data</li>
        </ul>

        <h2 className="text-lg font-bold text-ink">4. How We Use Your Data</h2>
        <p>We process your personal data for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Platform functionality:</strong> To provide personalized certification roadmaps, track your learning progress, and display relevant job listings (Legal basis: Art. 6(1)(b) GDPR — contract performance)</li>
          <li><strong>Platform improvement:</strong> To understand how students use Clairy and improve our lessons and features (Legal basis: Art. 6(1)(f) GDPR — legitimate interest)</li>
          <li><strong>Communication:</strong> To send you updates about new features or lessons, if you opt in (Legal basis: Art. 6(1)(a) GDPR — consent)</li>
        </ul>

        <h2 className="text-lg font-bold text-ink">5. Data Storage & Security</h2>
        <p>
          During the prototype phase, most user data (profile, progress) is stored locally in your
          browser's localStorage. When server-side features are enabled, data is stored in Supabase
          (hosted in the EU, Frankfurt region) with encryption at rest and in transit.
        </p>
        <p>
          We implement appropriate technical and organizational measures to protect your data,
          including HTTPS encryption, access controls, and regular security reviews.
        </p>

        <h2 className="text-lg font-bold text-ink">6. Data Sharing</h2>
        <p>We do not sell your personal data. We may share data with:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Hosting providers:</strong> Vercel (website hosting), Supabase (database) — both GDPR-compliant with EU data processing</li>
          <li><strong>University partners:</strong> Anonymized, aggregated usage statistics only (never individual student data) — only with your university's consent</li>
          <li><strong>Legal requirements:</strong> If required by Polish law or a valid court order</li>
        </ul>

        <h2 className="text-lg font-bold text-ink">7. Your Rights (GDPR)</h2>
        <p>Under GDPR, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Access</strong> — Request a copy of all personal data we hold about you</li>
          <li><strong>Rectification</strong> — Correct any inaccurate personal data</li>
          <li><strong>Erasure</strong> — Request deletion of your personal data ("right to be forgotten")</li>
          <li><strong>Portability</strong> — Receive your data in a machine-readable format</li>
          <li><strong>Restriction</strong> — Request that we limit processing of your data</li>
          <li><strong>Objection</strong> — Object to processing based on legitimate interest</li>
          <li><strong>Withdraw consent</strong> — Where processing is based on consent, withdraw it at any time</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:centruminnowacji@warszawa.merito.pl" className="text-rust hover:underline">
            centruminnowacji@warszawa.merito.pl
          </a>.
          We will respond within 30 days.
        </p>

        <h2 className="text-lg font-bold text-ink">8. Cookies & Local Storage</h2>
        <p>
          Clairy uses browser localStorage to save your onboarding profile and learning progress.
          This data stays on your device and is not transmitted to our servers unless you create
          an account. We do not use third-party tracking cookies or advertising trackers.
        </p>

        <h2 className="text-lg font-bold text-ink">9. Data Retention</h2>
        <p>
          We retain your personal data only as long as necessary for the purposes described above.
          Local storage data persists until you clear your browser data. Server-side account data
          is retained until you request deletion or for 2 years after your last login, whichever
          comes first.
        </p>

        <h2 className="text-lg font-bold text-ink">10. Children's Privacy</h2>
        <p>
          Clairy is designed for university students (typically 18+). We do not knowingly collect
          data from children under 16. If you believe we have collected data from a minor,
          please contact us immediately.
        </p>

        <h2 className="text-lg font-bold text-ink">11. International Transfers</h2>
        <p>
          Your data is processed within the European Economic Area (EEA). If any data is transferred
          outside the EEA, we ensure appropriate safeguards are in place, including Standard
          Contractual Clauses approved by the European Commission.
        </p>

        <h2 className="text-lg font-bold text-ink">12. Supervisory Authority</h2>
        <p>
          You have the right to lodge a complaint with the Polish supervisory authority:
          Prezes Urzędu Ochrony Danych Osobowych (PUODO), ul. Stawki 2, 00-193 Warszawa,{" "}
          <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer" className="text-rust hover:underline">
            uodo.gov.pl
          </a>
        </p>

        <h2 className="text-lg font-bold text-ink">13. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy as Clairy evolves. Changes will be posted on this page
          with an updated date. We encourage you to review this policy periodically.
        </p>
      </section>

      <div className="pt-4 border-t border-ink/10">
        <Link to="/" className="text-sm text-rust hover:underline">Back to home</Link>
      </div>
    </div>
  );
}
