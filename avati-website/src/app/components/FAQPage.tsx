import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTheme } from "../App";
import { useSEO, buildSanityImageUrl } from "../../lib/seo/seoManager";
import { sanityClient } from "../../utils/sanityClient";
import { buildFAQSchema } from "../../lib/seo/schemaBuilder";

const faqCategories = [
  {
    category: "Storage Costs & Safety",
    faqs: [
      {
        q: "How much does self storage cost per month in Bangalore?",
        a: "At Avati Safe Storage, monthly storage costs depend on the volume of your belongings. For a 1 BHK household, expect \u20b92,500\u2013\u20b94,500/month. A 2 BHK ranges from \u20b94,500\u2013\u20b97,500/month, while a 3 BHK costs \u20b97,500\u2013\u20b912,000/month. Pricing includes professional packing materials, doorstep pickup from anywhere in Bangalore, secure 24/7 CCTV-monitored warehousing, and pest-free climate-managed storage. Vehicle storage starts at \u20b91,500/month for bikes and \u20b93,500/month for cars. Luggage and document storage starts from \u20b9999/month. Long-term commitments of 6 months or more qualify for discounted rates. Get an exact quote instantly using our online tool or call +91 8095589888."
      },
      {
        q: "How does Avati Safe Storage protect items from Bangalore monsoon moisture and pests?",
        a: "We employ a multi-layer protection protocol specifically designed for Bangalore's tropical climate. All stored items are elevated on industrial wooden pallets, keeping them 6\u20138 inches off the ground to prevent moisture contact during heavy monsoon rains. Our warehouse features commercial-grade dehumidification and ventilation systems maintaining optimal humidity year-round. Pest control is administered monthly by certified professionals using food-safe, non-toxic treatments. Every item is individually wrapped in industrial-grade bubble wrap, foam padding, and moisture-resistant shrink wrap. Our facility at Kalkere, Horamavu is a purpose-built concrete warehouse with sealed flooring and rainwater drainage systems \u2014 not a converted residential space."
      },
      {
        q: "Is there insurance coverage for goods stored at Avati Safe Storage?",
        a: "Yes. We offer goods-in-storage insurance coverage for customers on our Platinum Key (Pro Plan), protecting against damage from fire, natural disasters, and structural incidents. We maintain a 100% claim-free track record since our establishment in 2020. For Silver Key (Basic Plan) and Gold Key (Premium Plan) customers, we recommend maintaining your existing homeowner's or renter's insurance policy that covers off-premises belongings. Our facility itself is fully insured with comprehensive structural and liability coverage. Every customer receives a detailed digital inventory with photographic documentation at the time of storage, ensuring complete transparency and proof of condition."
      },
      {
        q: "How quickly can I retrieve my stored items?",
        a: "Retrieval timelines depend on your plan. Platinum Key (Pro Plan) customers enjoy same-day retrieval — request before noon and your items are delivered to your doorstep by evening. Gold Key (Premium Plan) customers get guaranteed next-day delivery within 24 hours. Silver Key (Basic Plan) retrievals are completed within 24–48 hours. Partial retrieval is available — you don't need to take back everything at once. For urgent needs, call us directly at +91 8095589888 and we'll accommodate expedited requests wherever possible. Delivery is available to any address across Bangalore including Whitefield, Indiranagar, Koramangala, HSR Layout, Marathahalli, and all 50+ areas we serve."
      },
      {
        q: "Does Avati Safe Storage offer free doorstep pickup in Bangalore?",
        a: "Yes, we provide complimentary doorstep pickup across all of Bangalore \u2014 it's included in every plan at no extra cost. Our trained packing team arrives at your home or office at your scheduled time, professionally packs every item using bubble wrap, foam, and corrugated boxes, and transports them safely to our facility in Kalkere, Horamavu. We serve 50+ neighborhoods including Whitefield, Indiranagar, Koramangala, HSR Layout, Marathahalli, Hebbal, JP Nagar, Electronic City, and more. Schedule a free pickup consultation by calling +91 8095589888 or generate an instant quote online."
      },
    ]
  },
  {
    category: "General",
    faqs: [
      {
        q: "What is Avati Safe Storage and how does it work?",
        a: "Avati Safe Storage is a professional storage facility located in Horamavu, Bangalore. We pick up your items from your home or office, professionally pack them, transport them to our secure warehouse, and store them for as long as you need. When you want your items back, we deliver them to your door."
      },
      {
        q: "Where is Avati Safe Storage located?",
        a: "Our storage facility is located at #429/5, 8th Main, N.R.I. Layout, Kalkere, Horamavu Post, Bangalore – 560043. We serve all areas across Bangalore with our doorstep pickup and delivery service."
      },
      {
        q: "How long can I store my belongings?",
        a: "We offer flexible storage terms — from as short as 1 month to as long as you need. There are no long-term contracts. Most of our customers store for 3–12 months during relocations, renovations, or extended travel."
      },
      {
        q: "What types of items can I store?",
        a: "We store household furniture, appliances, clothes, electronics, documents, office equipment, artwork, and more. We also offer vehicle storage for cars and bikes. Items that cannot be stored include perishables, flammable materials, and illegal substances."
      },
    ]
  },
  {
    category: "Pickup & Delivery",
    faqs: [
      {
        q: "Do you offer doorstep pickup?",
        a: "Yes! Doorstep pickup is included with all our plans. Our trained team comes to your location across Bangalore, professionally packs your items, and transports them safely to our warehouse. You don't need to lift a finger."
      },
      {
        q: "How much notice do I need to give for pickup?",
        a: "We typically require 24–48 hours notice for scheduling a pickup. For urgent needs, please call us directly and we'll do our best to accommodate you."
      },
      {
        q: "How do I get my items back?",
        a: "Simply call or WhatsApp us with your retrieval request. We will schedule a delivery to your door. For Platinum Key (Pro Plan) customers, same-day retrieval is available. Silver Key / Gold Key plan customers can expect 24–48 hours turnaround."
      },
      {
        q: "Can I come to the facility to access my items myself?",
        a: "Yes, you can schedule a visit to our facility with prior appointment. Our facility operates during business hours and our staff will assist you in locating your items."
      },
    ]
  },
  {
    category: "Pricing & Plans",
    faqs: [
      {
        q: "How do you calculate storage charges?",
        a: "Storage is calculated based on the volume (cubic feet) of your items and the duration of storage. We offer three plans — Silver Key (Basic Plan), Gold Key (Premium Plan), and Platinum Key (Pro Plan) — each with different features and pricing. Use our quote tool to get an exact price."
      },
      {
        q: "Are there any hidden charges?",
        a: "No hidden charges. Our quotes include all costs upfront — pickup, packing materials, storage, and delivery. The only additional charges would be for specialty packing for fragile or valuable items, which we inform you about in advance."
      },
      {
        q: "Do you have a minimum storage period?",
        a: "Our minimum storage period is one month. After that, you can retrieve your items or continue month-to-month."
      },
      {
        q: "Do you offer any discounts for long-term storage?",
        a: "Yes! We offer discounted rates for storage commitments of 6 months or more. Contact us directly for long-term pricing tailored to your needs."
      },
    ]
  },
  {
    category: "Safety & Security",
    faqs: [
      {
        q: "Is my storage facility monitored 24/7?",
        a: "Yes. Our facility has CCTV cameras and security personnel round the clock. We take security seriously to give you complete peace of mind while your belongings are in our care."
      },
      {
        q: "How do you protect items from damage?",
        a: "We professionally pack all items using bubble wrap, foam padding, and shrink wrap. Items are placed on elevated wooden pallets to protect from moisture. Our facility has pest control treatments performed regularly."
      },
      {
        q: "Is there fire safety at the facility?",
        a: "Yes. Our facility is equipped with fire extinguishers and smoke detection systems. We follow all safety protocols to ensure your items are protected."
      },
      {
        q: "Are my goods insured while in storage?",
        a: "Platinum Key (Pro Plan) customers enjoy goods-in-storage insurance coverage. For Silver Key (Basic Plan) and Gold Key (Premium Plan) plans, we recommend you maintain your own contents insurance. Contact us for details on our insurance coverage."
      },
    ]
  },
  {
    category: "Packing & Handling",
    faqs: [
      {
        q: "Do I need to pack my items before pickup?",
        a: "No, you don't have to. Our team handles all packing at your doorstep. However, if you prefer to pack some items yourself, that's fine too. We'll secure and wrap them properly before transport."
      },
      {
        q: "How do you handle fragile items like glassware and artwork?",
        a: "Fragile items receive special attention — they are wrapped in multiple layers of bubble wrap, placed in custom boxes, and marked clearly. Our team is trained to handle all types of items with care."
      },
      {
        q: "Will I receive a list of everything stored?",
        a: "Yes! We prepare a digital inventory list of all your stored items. This helps you track everything and makes retrieval easy and organized."
      },
      {
        q: "Do you offer packing services for vehicles?",
        a: "For vehicles, we don't use packing materials but we take care of safe transport and secure storage. Vehicles are stored in covered bays within our compound."
      },
    ]
  },
];

export function FAQPage() {
  const { dark } = useTheme();
  const [activeCategory, setActiveCategory] = useState("General");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [cmsData, setCmsData] = useState<any>(null);

  useEffect(() => {
    sanityClient.fetch<any>(`*[_id == "page-faqs"][0] {
      faqHeroTitle,
      faqList,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      noIndex,
      customSchema,
      ogTitle,
      ogDescription,
      openGraphImage
    }`).then(setCmsData).catch(() => {});
  }, []);

  // Map CMS FAQs to category General dynamically if available, otherwise fallback to static list
  const hasCmsFaqs = cmsData?.faqList && cmsData.faqList.length > 0;
  const cmsFaqCategories = hasCmsFaqs 
    ? [
        {
          category: "General",
          faqs: cmsData.faqList.map((f: any) => ({ q: f.question, a: f.answer }))
        },
        ...faqCategories.filter(c => c.category !== "General")
      ]
    : faqCategories;

  const currentFaqs = cmsFaqCategories.find(c => c.category === activeCategory)?.faqs || [];

  let schemaFaqs = currentFaqs.map(f => ({ question: f.q, answer: f.a }));
  let parsedSchema: any = buildFAQSchema(schemaFaqs);
  if (cmsData?.customSchema) {
    try {
      parsedSchema = JSON.parse(cmsData.customSchema);
    } catch {}
  }

  useSEO({
    title: cmsData?.metaTitle || 'Frequently Asked Questions | Avati Safe Storage',
    description: cmsData?.metaDescription || 'Everything you need to know about Avati Safe Storage services, pricing plans, security measures, monsoon protection, and delivery across Bangalore.',
    canonical: cmsData?.canonicalUrl || 'https://www.avatisafestorage.com/faq',
    noIndex: cmsData?.noIndex !== undefined ? cmsData.noIndex : false,
    schema: parsedSchema,
    keywords: cmsData?.metaKeywords,
    og: {
      title: cmsData?.ogTitle || cmsData?.metaTitle,
      description: cmsData?.ogDescription || cmsData?.metaDescription,
      imageUrl: cmsData?.openGraphImage?.asset?._ref ? buildSanityImageUrl(cmsData.openGraphImage.asset._ref) : undefined,
      type: 'website',
    }
  });

  const heroTitle = cmsData?.faqHeroTitle || "Frequently Asked Questions";

  return (
    <main className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative py-16 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.03,
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-bold uppercase tracking-widest"
            style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}>
            <HelpCircle className="w-3.5 h-3.5" />
            Help Center
          </div>
          <h1 className="font-black tracking-tight mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
            {heroTitle}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to know about Avati Safe Storage. Can't find your answer? <a href="tel:+918095589888" className="text-[#D4AF37] font-semibold">Call us</a>.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-16 z-30 py-3" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {faqCategories.map(cat => (
              <button
                key={cat.category}
                onClick={() => { setActiveCategory(cat.category); setOpenIndex(null); }}
                className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activeCategory === cat.category ? 'var(--gold)' : 'var(--bg-secondary)',
                  color: activeCategory === cat.category ? '#000' : 'var(--text-secondary)',
                }}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-3">
          {currentFaqs.map((faq, i) => (
            <motion.div
              key={`${activeCategory}-${i}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl overflow-hidden"
              style={{
                background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: `1px solid ${openIndex === i ? 'var(--gold-border)' : 'var(--border-color)'}`,
                boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
              >
                <span className="text-sm sm:text-base font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {faq.q}
                </span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                  style={{ color: 'var(--gold)', transform: openIndex === i ? 'rotate(180deg)' : 'none' }}
                />
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <div className="h-px mb-4" style={{ background: 'var(--border-color)' }} />
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 rounded-2xl p-8 text-center"
          style={{
            background: dark ? 'rgba(212,175,55,0.06)' : 'rgba(212,175,55,0.05)',
            border: '1px solid var(--gold-border)',
          }}>
          <HelpCircle className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--gold)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Still have questions?</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            Our team is happy to help. Reach out via phone or WhatsApp.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="tel:+918095589888" className="avati-btn-gold text-sm">
              Call +91 80955 89888
            </a>
            <a href="https://wa.me/918095589888" target="_blank" rel="noopener noreferrer" className="avati-btn-ghost text-sm">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
