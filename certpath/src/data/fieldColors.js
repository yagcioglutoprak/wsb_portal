/**
 * Field-specific color identities and shared semantic color maps.
 * Import these instead of hardcoding colors per-page.
 */

export const fieldColors = {
  cybersecurity:            { accent: '#0d9488', bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200' },
  'cloud-engineering':      { accent: '#0ea5e9', bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200' },
  devops:                   { accent: '#f97316', bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200' },
  'data-science':           { accent: '#8b5cf6', bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200' },
  'backend-development':    { accent: '#6366f1', bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200' },
  networking:               { accent: '#0f766e', bg: 'bg-teal-50',    text: 'text-teal-800',    border: 'border-teal-300' },
  'frontend-development':   { accent: '#f43f5e', bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
  itsm:                     { accent: '#64748b', bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200' },
  'finance-accounting':     { accent: '#f59e0b', bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  management:               { accent: '#3b82f6', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  'logistics-supply-chain': { accent: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export const experienceLevelColors = {
  junior: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Junior' },
  mid:    { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Mid-level' },
  senior: { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  label: 'Senior' },
};

/** Get a field's color config by slug. Falls back to blue. */
export function getFieldColor(slug) {
  return fieldColors[slug] || { accent: '#DF5433', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
}
