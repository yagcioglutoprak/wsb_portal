import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Terms of Service</h1>
        <p className="mt-1 text-sm text-pencil">Last updated: March 18, 2026</p>
      </div>

      <section className="space-y-4 text-[15px] text-graphite leading-relaxed">
        <h2 className="text-lg font-bold text-ink">1. About Clairy</h2>
        <p>
          Clairy is an interactive career development platform designed for university students.
          It provides personalized certification roadmaps, interactive lessons, job and internship
          listings, and skills tracking tools. Clairy was created by students at WSB Merito University
          and is currently in prototype stage.
        </p>

        <h2 className="text-lg font-bold text-ink">2. Acceptance of Terms</h2>
        <p>
          By accessing or using Clairy, you agree to be bound by these Terms of Service. If you
          do not agree to these terms, please do not use the platform.
        </p>

        <h2 className="text-lg font-bold text-ink">3. Eligibility</h2>
        <p>
          Clairy is available to anyone, but is primarily designed for university students in Poland
          and across Europe. You must be at least 16 years old to use the platform.
        </p>

        <h2 className="text-lg font-bold text-ink">4. User Accounts</h2>
        <p>
          Some features of Clairy may require you to create an account. You are responsible for
          maintaining the confidentiality of your account credentials and for all activities that
          occur under your account. You agree to provide accurate and complete information when
          creating your account.
        </p>

        <h2 className="text-lg font-bold text-ink">5. Platform Content</h2>
        <p>
          Clairy provides educational content including interactive lessons, certification information,
          and job listings. While we strive to keep all information accurate and up-to-date:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Certification details (costs, requirements, durations) may change without notice by their respective providers.</li>
          <li>Job listings are sourced from public data and may not reflect current availability.</li>
          <li>Lesson content is for educational purposes and does not replace official certification training.</li>
        </ul>

        <h2 className="text-lg font-bold text-ink">6. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use the platform for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to any part of the platform</li>
          <li>Copy, reproduce, or distribute platform content without permission</li>
          <li>Interfere with the proper functioning of the platform</li>
          <li>Use automated tools to scrape or extract data from the platform</li>
        </ul>

        <h2 className="text-lg font-bold text-ink">7. Intellectual Property</h2>
        <p>
          All content on Clairy — including interactive lessons, design elements, the widget library,
          certification pathway data, and the Clairy brand — is the intellectual property of the
          Clairy team. You may not reproduce, distribute, or create derivative works from this
          content without explicit written permission.
        </p>

        <h2 className="text-lg font-bold text-ink">8. Data & Progress</h2>
        <p>
          Your learning progress, XP, and profile data are stored locally on your device and/or
          on our servers. We may reset progress data during the prototype phase as the platform
          evolves. We will provide notice before any such reset when possible.
        </p>

        <h2 className="text-lg font-bold text-ink">9. Disclaimer</h2>
        <p>
          Clairy is provided "as is" without warranties of any kind. We do not guarantee that the
          platform will be uninterrupted, error-free, or that any certification path will result in
          employment. Career outcomes depend on many factors beyond the scope of this platform.
        </p>

        <h2 className="text-lg font-bold text-ink">10. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Clairy and its creators shall not be liable for
          any indirect, incidental, or consequential damages arising from your use of the platform,
          including but not limited to lost data, lost opportunities, or career decisions made based
          on platform content.
        </p>

        <h2 className="text-lg font-bold text-ink">11. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be posted on this page
          with an updated date. Continued use of Clairy after changes constitutes acceptance of the
          new terms.
        </p>

        <h2 className="text-lg font-bold text-ink">12. Governing Law</h2>
        <p>
          These terms are governed by the laws of the Republic of Poland. Any disputes shall be
          resolved in the courts of Warsaw, Poland.
        </p>

        <h2 className="text-lg font-bold text-ink">13. Contact</h2>
        <p>
          For questions about these terms, contact us at{" "}
          <a href="mailto:centruminnowacji@warszawa.merito.pl" className="text-rust hover:underline">
            centruminnowacji@warszawa.merito.pl
          </a>
        </p>
      </section>

      <div className="pt-4 border-t border-ink/10">
        <Link to="/" className="text-sm text-rust hover:underline">Back to home</Link>
      </div>
    </div>
  );
}
