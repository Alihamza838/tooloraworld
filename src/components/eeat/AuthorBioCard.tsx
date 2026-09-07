import React from 'react';
import { AuthorProfile } from '../../types';
import { AUTHORS } from '../../data/authors';
import { ShieldCheck, Award, Globe, Linkedin, Github, Twitter, Mail } from 'lucide-react';

interface AuthorBioCardProps {
  authorId: string;
  reviewerId?: string;
}

export const AuthorBioCard: React.FC<AuthorBioCardProps> = ({ authorId, reviewerId }) => {
  const author: AuthorProfile = AUTHORS[authorId] || AUTHORS['dr-marcus-vance'];
  const reviewer: AuthorProfile | undefined = reviewerId ? AUTHORS[reviewerId] : undefined;

  return (
    <section 
      className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50/50 to-orange-50/20 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800/40 p-6 shadow-sm"
      aria-label="Author Profile & Credentials"
    >
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-orange-500/20 shrink-0 [image-rendering:-webkit-optimize-contrast]"
          loading="lazy"
        />

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {author.name}
                </h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  Verified Analyst
                </span>
              </div>
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                {author.role}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {author.socials.linkedin && (
                <a
                  href={author.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-orange-600 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {author.socials.github && (
                <a
                  href={author.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-orange-600 transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {author.socials.twitter && (
                <a
                  href={author.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-orange-600 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {author.socials.website && (
                <a
                  href={author.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-orange-600 transition-colors"
                  title="Official Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            {author.bio}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
              Domain Specialties:
            </span>
            {author.specialties.map((spec, idx) => (
              <span 
                key={idx} 
                className="text-[11px] bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60"
              >
                {spec}
              </span>
            ))}
          </div>

          {reviewer && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                <strong>Peer Editorial Audit:</strong> Independently fact-checked and verified by {reviewer.name} ({reviewer.credentials}).
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
