// ============================================================
//  RenderBlocks Component (Live Visual Editing Enabled)
//  Path: avati-website/src/app/components/RenderBlocks.tsx
// ============================================================

import { createDataAttribute } from '@sanity/visual-editing';
import { ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

// Initialize the data attribute encoder for interactive CMS overlay clicks
const encodeDataAttribute = createDataAttribute({
  baseUrl: 'https://avati-safe-storage.sanity.studio',
  projectId: 'bv8ffbbk',
  dataset: 'production',
});

interface BlockProps {
  pageId: string;
  pageBuilder: any[];
}

export function RenderBlocks({ pageId, pageBuilder }: BlockProps) {
  if (!pageBuilder || pageBuilder.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed rounded-2xl max-w-md mx-auto my-12" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
        <HelpCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--gold)' }} />
        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Empty Page Layout</h3>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Start building this page by dragging and stacking components in the Sanity Studio Page Builder!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {pageBuilder.map((block, index) => {
        // Construct the click-to-edit target string for this entire block in the pageBuilder array
        const blockAttribute = encodeDataAttribute([
          pageId,
          'pageBuilder',
          index,
        ]);

        switch (block._type) {
          // 1. HERO BLOCK RENDERER
          case 'heroBlock':
            return (
              <section
                key={block._key || index}
                data-sanity={blockAttribute} // 👈 Master click target
                className="relative py-24 px-6 md:px-12 flex items-center justify-center overflow-hidden border border-dashed border-transparent hover:border-amber-500/30 transition-all duration-300"
                style={{
                  minHeight: '65vh',
                  background: 'var(--bg-glass)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Background light reflections */}
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full opacity-30 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }}
                />
                
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <h1
                      data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'title'])}
                      className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text"
                      style={{ backgroundImage: 'linear-gradient(135deg, var(--text-primary) 30%, var(--gold) 100%)' }}
                    >
                      {block.title || 'Modular Space Solutions'}
                    </h1>
                    
                    <p
                      data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'subtitle'])}
                      className="text-base sm:text-lg max-w-xl leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {block.subtitle || 'Secure, climate-controlled personal and commercial storage systems with global edge pickup in Bangalore.'}
                    </p>

                    {(block.ctaText || block.ctaLink) && (
                      <div className="pt-4 flex flex-wrap gap-4">
                        <a
                          href={block.ctaLink || '/get-quote'}
                          data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'ctaText'])}
                          className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:brightness-105 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-[0.98] inline-flex items-center gap-2"
                        >
                          {block.ctaText || 'Get Started'} <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  {block.backgroundImage?.asset && (
                    <div
                      data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'backgroundImage'])}
                      className="lg:col-span-5 aspect-square rounded-3xl overflow-hidden border shadow-2xl relative bg-neutral-900 group"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <img
                        src={block.backgroundImage.asset._ref ? `https://cdn.sanity.io/images/bv8ffbbk/production/${block.backgroundImage.asset._ref.replace('image-', '').replace('-webp', '.webp').replace('-png', '.png').replace('-jpg', '.jpg')}` : ''}
                        alt={block.title || 'Hero Background'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                    </div>
                  )}
                </div>
              </section>
            );

          // 2. TEXT CONTENT BLOCK RENDERER
          case 'textContentBlock':
            return (
              <section
                key={block._key || index}
                data-sanity={blockAttribute} // 👈 Master click target
                className="py-16 px-6 max-w-4xl mx-auto border border-dashed border-transparent hover:border-amber-500/30 transition-all duration-300"
              >
                {block.heading && (
                  <h2
                    data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'heading'])}
                    className="text-3xl font-extrabold mb-6 tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {block.heading}
                  </h2>
                )}
                
                {block.body && (
                  <div
                    data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'body'])}
                    className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-6"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {/* Simplified block parser for basic structured arrays */}
                    {Array.isArray(block.body) ? (
                      block.body.map((childBlock: any, cIdx: number) => {
                        if (childBlock._type === 'block' && childBlock.children) {
                          const text = childBlock.children.map((c: any) => c.text).join(' ');
                          if (childBlock.style === 'blockquote') {
                            return (
                              <blockquote key={cIdx} className="border-l-4 pl-4 italic my-4" style={{ borderColor: 'var(--gold)', color: 'var(--text-primary)' }}>
                                {text}
                              </blockquote>
                            );
                          }
                          if (childBlock.style === 'h3') {
                            return <h3 key={cIdx} className="text-xl font-bold mt-8 mb-2" style={{ color: 'var(--text-primary)' }}>{text}</h3>;
                          }
                          if (childBlock.style === 'h4') {
                            return <h4 key={cIdx} className="text-lg font-bold mt-6 mb-2" style={{ color: 'var(--gold)' }}>{text}</h4>;
                          }
                          return <p key={cIdx} className="mb-4">{text}</p>;
                        }
                        return null;
                      })
                    ) : (
                      <p>{block.body}</p>
                    )}
                  </div>
                )}
              </section>
            );

          // 3. STATS BLOCK RENDERER
          case 'statsBlock':
            return (
              <section
                key={block._key || index}
                data-sanity={blockAttribute} // 👈 Master click target
                className="py-16 px-6 max-w-7xl mx-auto border border-dashed border-transparent hover:border-amber-500/30 transition-all duration-300 text-center space-y-12"
              >
                {block.heading && (
                  <h2
                    data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'heading'])}
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {block.heading}
                  </h2>
                )}

                {block.stats && block.stats.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {block.stats.map((stat: any, sIdx: number) => {
                      const statHighlight = stat.color === 'gold' 
                        ? 'var(--gold)' 
                        : stat.color === 'navy' 
                          ? '#0b1f3a' 
                          : 'var(--text-primary)';
                          
                      return (
                        <div
                          key={stat._key || sIdx}
                          data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'stats', sIdx])} // 👈 Granular index click target
                          className="p-8 rounded-2xl border flex flex-col justify-center items-center shadow-lg transition-transform duration-300 hover:-translate-y-1"
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                          }}
                        >
                          <span
                            className="text-4xl sm:text-5xl font-black mb-3 select-none"
                            style={{ color: statHighlight }}
                          >
                            {stat.value || '0+'}
                          </span>
                          <span
                            className="text-sm font-bold uppercase tracking-wider text-center"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {stat.label || 'Feature Metrics'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );

          // 4. FAQ BLOCK RENDERER
          case 'faqBlock':
            return (
              <section
                key={block._key || index}
                data-sanity={blockAttribute} // 👈 Master click target
                className="py-16 px-6 max-w-4xl mx-auto border border-dashed border-transparent hover:border-amber-500/30 transition-all duration-300 space-y-8"
              >
                {block.heading && (
                  <h2
                    data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'heading'])}
                    className="text-3xl font-extrabold tracking-tight text-center"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {block.heading}
                  </h2>
                )}

                {block.faqs && block.faqs.length > 0 && (
                  <div className="space-y-4">
                    {block.faqs.map((faq: any, fIdx: number) => (
                      <div
                        key={faq._key || fIdx}
                        data-sanity={encodeDataAttribute([pageId, 'pageBuilder', index, 'faqs', fIdx])} // 👈 Granular index click target
                        className="p-6 rounded-xl border text-left"
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          borderColor: 'var(--border-color)',
                        }}
                      >
                        <h4 className="text-base font-extrabold mb-2 flex items-start gap-2.5" style={{ color: 'var(--text-primary)' }}>
                          <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                          {faq.question}
                        </h4>
                        <p className="text-sm leading-relaxed pl-7" style={{ color: 'var(--text-secondary)' }}>
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
