'use client'

import { ExternalLink } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { projects } from '@/lib/projects'

export default function Portfolio() {
  const { lang } = useLanguage()
  const tr = t[lang].portfolio

  return (
    <section id="portfolio" className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{tr.headline}</h2>
        {projects.length === 0 ? (
          <p className="text-center text-zinc-500">{tr.empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-zinc-800 rounded-xl overflow-hidden hover:border-brand transition-colors"
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold group-hover:text-brand transition-colors">
                      {project.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-zinc-500" />
                  </div>
                  <p className="text-zinc-400 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
