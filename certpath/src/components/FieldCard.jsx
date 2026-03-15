import { Link } from "react-router-dom";
import { certifications, jobs } from "../data/mock";
import {
  CybersecurityIcon,
  CloudIcon,
  DevOpsIcon,
  DataScienceIcon,
  BackendIcon,
  NetworkingIcon,
  ITSMIcon,
  FrontendIcon,
  FinanceIcon,
  ManagementIcon,
  LogisticsIcon,
} from "./Icons";

const fieldIcons = {
  cybersecurity: CybersecurityIcon,
  "cloud-engineering": CloudIcon,
  devops: DevOpsIcon,
  "data-science": DataScienceIcon,
  "backend-development": BackendIcon,
  networking: NetworkingIcon,
  itsm: ITSMIcon,
  "frontend-development": FrontendIcon,
  "finance-accounting": FinanceIcon,
  management: ManagementIcon,
  "logistics-supply-chain": LogisticsIcon,
};

export default function FieldCard({ field, index }) {
  const fieldCerts = certifications[field.slug] || [];
  const certCount = fieldCerts.length;
  const jobCount = jobs.filter((j) => j.fieldId === field.id).length;
  const months = Math.round(
    fieldCerts.reduce((sum, c) => sum + c.durationWeeks, 0) / 4
  );
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      to={`/fields/${field.slug}`}
      className="group relative block rounded-lg border border-faint bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top accent line -- reveals on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-rust transition-transform duration-300 group-hover:scale-x-100" />

      {/* Field icon — top right */}
      {(() => {
        const Icon = fieldIcons[field.slug];
        return Icon ? (
          <Icon className="absolute right-5 top-5 h-8 w-8 text-pencil/40 transition-colors duration-300 group-hover:text-rust" />
        ) : null;
      })()}

      {/* Figure number */}
      <span className="font-mono text-xs font-light tracking-wider text-pencil">
        {num}
      </span>

      {/* Field name */}
      <h3 className="mt-3 font-serif text-xl italic text-ink transition-colors duration-200 group-hover:text-rust">
        {field.name}
      </h3>

      {/* Short description */}
      <p className="mt-2 text-sm leading-relaxed text-graphite">
        {field.description}
      </p>

      {/* Stats row */}
      <div className="mt-4 flex items-center gap-4 border-t border-faint pt-3">
        <span className="font-mono text-xs tracking-wider text-pencil">
          {certCount} certs
        </span>
        <span className="text-faint">|</span>
        <span className="font-mono text-xs tracking-wider text-pencil">
          {jobCount} jobs
        </span>
        <span className="text-faint">|</span>
        <span className="font-mono text-xs tracking-wider text-pencil">
          ~{months} mo
        </span>
      </div>

      {/* View roadmap link */}
      <p className="mt-3 font-mono text-xs uppercase tracking-wider text-rust transition-colors duration-200 group-hover:underline">
        View roadmap &rarr;
      </p>
    </Link>
  );
}
