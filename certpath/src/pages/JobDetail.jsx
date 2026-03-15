import { useParams, Link } from "react-router-dom";
import { fields, certifications, jobs } from "../data/mock";

const levelLabel = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
};

const levelStyle = {
  junior: "bg-success/10 text-success border-success/20",
  mid: "bg-merito/10 text-merito border-merito/20",
  senior: "bg-rust/10 text-rust border-rust/20",
};

function generateJobDescription(job, field) {
  const fieldName = field ? field.name : "technology";
  const skillList = job.requiredSkills.slice(0, 3).join(", ");
  const levelText = levelLabel[job.experienceLevel] || job.experienceLevel;

  const descriptions = {
    junior: `This is an entry-level ${fieldName} position at ${job.company} in ${job.location}. The role is designed for professionals starting their career, with a focus on building hands-on experience in ${skillList}. You will work alongside senior team members, contributing to day-to-day operations while developing your technical skills through structured mentoring and real-world projects. Strong motivation to learn and relevant certifications are valued over extensive work experience.`,
    mid: `${job.company} is looking for a ${levelText} ${fieldName} professional to join their team in ${job.location}. The ideal candidate has a solid foundation in ${skillList} and is ready to take on increasing responsibility. You will be expected to work independently on assigned tasks, contribute to technical decisions, and mentor junior colleagues. This role offers opportunities for growth into a senior position as you deepen your expertise and expand your impact across the organization.`,
    senior: `This senior ${fieldName} role at ${job.company} in ${job.location} requires deep expertise in ${skillList} and the ability to drive technical strategy. You will lead key initiatives, architect solutions for complex challenges, and serve as a technical authority within the team. The position demands strong communication skills for cross-functional collaboration, as well as experience guiding and mentoring less experienced engineers. The ideal candidate brings a proven track record of delivering results in a demanding, fast-paced environment.`,
  };

  return descriptions[job.experienceLevel] || descriptions.mid;
}

function generateSkillDescription(skill) {
  const descriptions = {
    SIEM: "Security Information and Event Management tools for real-time monitoring and threat detection",
    "Security+": "CompTIA Security+ certified knowledge of network security fundamentals and threat mitigation",
    "Incident Response": "Ability to detect, contain, and remediate security incidents following established procedures",
    "TCP/IP": "Deep understanding of networking protocols and how data flows across networks",
    "Penetration Testing": "Hands-on skills in identifying and exploiting vulnerabilities in systems and applications",
    OSCP: "Offensive Security Certified Professional level penetration testing and exploitation skills",
    "Web Application Security": "Knowledge of OWASP Top 10 and secure coding practices for web applications",
    Burp: "Proficiency with Burp Suite for web application security testing and vulnerability assessment",
    AWS: "Amazon Web Services cloud platform, including core services and best practices",
    Terraform: "Infrastructure as Code using HashiCorp Terraform for provisioning and managing cloud resources",
    Docker: "Containerization with Docker for building, shipping, and running applications consistently",
    Kubernetes: "Container orchestration with Kubernetes for deploying and managing containerized applications at scale",
    "CI/CD": "Continuous Integration and Continuous Deployment pipelines for automated software delivery",
    Jenkins: "Automation server for building, testing, and deploying software projects",
    Python: "Python programming for scripting, automation, data analysis, and machine learning",
    SQL: "Structured Query Language for database management, querying, and data manipulation",
    Tableau: "Data visualization platform for creating interactive dashboards and business intelligence reports",
    Java: "Java programming language for building enterprise-grade server-side applications",
    "Spring Boot": "Spring Boot framework for rapid Java application development with auto-configuration",
    React: "React JavaScript library for building dynamic, component-based user interfaces",
    JavaScript: "Core JavaScript programming for both frontend and backend development",
    Figma: "Design and prototyping tool for creating user interfaces and design systems",
  };
  return descriptions[skill] || `Practical working knowledge of ${skill} in a professional environment`;
}

export default function JobDetail() {
  const { jobId } = useParams();
  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-serif text-3xl italic text-ink">Job not found</h1>
        <Link
          to="/jobs"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-wider text-rust hover:underline"
        >
          Back to jobs
        </Link>
      </div>
    );
  }

  const field = fields.find((f) => f.id === job.fieldId);
  const allCerts = Object.values(certifications).flat();
  const relatedCerts = job.certIds
    .map((cid) => allCerts.find((c) => c.id === cid))
    .filter(Boolean);

  // Find similar positions (same field, different job)
  const similarJobs = jobs
    .filter((j) => j.fieldId === job.fieldId && j.id !== job.id)
    .slice(0, 4);

  return (
    <section className="py-4">
      {/* Breadcrumb */}
      <nav
        className="mb-6 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        <ol className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-wider text-pencil">
          <li>
            <Link to="/jobs" className="transition-colors hover:text-rust">
              Jobs
            </Link>
          </li>
          <li>/</li>
          <li className="text-ink">{job.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div
        className="mb-10 animate-fade-in-up"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span
            className={[
              "rounded-full border px-4 py-1.5 font-mono text-xs tracking-wider",
              levelStyle[job.experienceLevel] || "bg-warm/50 text-graphite border-faint",
            ].join(" ")}
          >
            {levelLabel[job.experienceLevel] || job.experienceLevel}
          </span>
          {field && (
            <Link
              to={`/fields/${field.slug}`}
              className="rounded-full border border-faint bg-card px-4 py-1.5 font-mono text-xs tracking-wider text-graphite transition-colors hover:border-rust hover:text-rust"
            >
              {field.name}
            </Link>
          )}
        </div>
        <h1 className="font-serif text-3xl italic text-ink sm:text-4xl">
          {job.title}
        </h1>
        <p className="mt-2 text-lg text-graphite">{job.company}</p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            <div className="rounded-md border border-faint bg-card p-6">
              <span className="block font-mono text-xs uppercase tracking-widest text-pencil">
                Location
              </span>
              <span className="mt-1.5 block font-serif text-2xl italic text-ink">
                {job.location}
              </span>
            </div>
            <div className="rounded-md border border-success/20 bg-success/5 p-6">
              <span className="block font-mono text-xs uppercase tracking-widest text-pencil">
                Salary range
              </span>
              <span className="mt-1.5 block font-serif text-2xl italic text-ink">
                {job.salaryMin.toLocaleString("pl-PL")} - {job.salaryMax.toLocaleString("pl-PL")} PLN
              </span>
              <span className="mt-1 block text-xs text-graphite">
                Monthly gross, Poland
              </span>
            </div>
            <div className="rounded-md border border-faint bg-card p-6">
              <span className="block font-mono text-xs uppercase tracking-widest text-pencil">
                Experience level
              </span>
              <span className="mt-1.5 block font-serif text-2xl italic text-ink">
                {levelLabel[job.experienceLevel] || job.experienceLevel}
              </span>
              <span className="mt-1 block text-xs text-graphite">
                Posted {job.postedAt}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "220ms" }}
          >
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-pencil">
              Job description
            </h2>
            <div className="rounded-lg border border-faint bg-card p-6">
              <p className="text-sm leading-relaxed text-graphite">
                {generateJobDescription(job, field)}
              </p>
            </div>
          </div>

          {/* What employers expect */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "280ms" }}
          >
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-pencil">
              What employers expect
            </h2>
            <div className="flex flex-col gap-3">
              {job.requiredSkills.map((skill) => (
                <div
                  key={skill}
                  className="rounded-md border border-faint bg-card px-5 py-4"
                >
                  <span className="block text-sm font-semibold text-ink">
                    {skill}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-graphite">
                    {generateSkillDescription(skill)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Source link */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "340ms" }}
          >
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-rust px-6 py-3 font-mono text-xs uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
            >
              View original posting
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          {/* Similar positions */}
          {similarJobs.length > 0 && (
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-pencil">
                Similar positions
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {similarJobs.map((sj) => (
                  <Link
                    key={sj.id}
                    to={`/jobs/${sj.id}`}
                    className="group rounded-md border border-faint bg-card px-5 py-4 transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                  >
                    <span className="block text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-rust">
                      {sj.title}
                    </span>
                    <span className="mt-1 block text-sm text-graphite">
                      {sj.company} &middot; {sj.location}
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={[
                          "rounded-full border px-2.5 py-0.5 font-mono text-xs tracking-wider",
                          levelStyle[sj.experienceLevel] || "bg-warm/50 text-graphite border-faint",
                        ].join(" ")}
                      >
                        {levelLabel[sj.experienceLevel] || sj.experienceLevel}
                      </span>
                      <span className="font-mono text-xs tracking-wider text-graphite">
                        {sj.salaryMin.toLocaleString("pl-PL")} - {sj.salaryMax.toLocaleString("pl-PL")} PLN
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column -- related certs */}
        <div>
          <div
            className="rounded-lg border border-faint bg-card p-6 animate-fade-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-pencil">
              Related certifications
            </h2>
            {relatedCerts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {relatedCerts.map((cert, i) => {
                  const certField = fields.find((f) => f.id === cert.fieldId);
                  const certFieldSlug = certField ? certField.slug : cert.fieldId;
                  return (
                    <div
                      key={cert.id}
                      className="group rounded-md border border-faint bg-card px-5 py-4 transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:border-pencil/30 animate-fade-in-up"
                      style={{ animationDelay: `${(i + 4) * 80}ms` }}
                    >
                      <Link
                        to={`/fields/${certFieldSlug}/certs/${cert.id}`}
                        className="block"
                      >
                        <span className="block font-serif text-sm italic text-ink transition-colors duration-200 group-hover:text-rust">
                          {cert.name}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-graphite line-clamp-2">
                          {cert.description}
                        </span>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-mono text-xs tracking-wider text-pencil">
                            {cert.costPln.toLocaleString("pl-PL")} PLN
                          </span>
                          <span className="text-faint">|</span>
                          <span className="font-mono text-xs tracking-wider text-pencil">
                            ~{Math.round(cert.durationWeeks / 4)} months
                          </span>
                        </div>
                      </Link>
                      <Link
                        to={`/fields/${certFieldSlug}`}
                        className="mt-2 inline-block font-mono text-xs uppercase tracking-wider text-rust transition-colors duration-200 hover:underline"
                      >
                        View roadmap &rarr;
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-pencil">
                No specific certifications listed for this role.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
