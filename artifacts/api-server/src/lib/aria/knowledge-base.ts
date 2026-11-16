export interface AriaKnowledgeDocument {
  id: string;
  title: string;
  source: string;
  content: string;
}

export const ARIA_KNOWLEDGE_DOCUMENTS: AriaKnowledgeDocument[] = [
  {
    id: "guest-faq",
    title: "Guest FAQ",
    source: "SEED Resort website · Frequently asked questions",
    content: "Guests can chat with Aria without an account. Signing in saves chat history. Aria can help with room, dining, spa, transport, and activity requests, but reservations are subject to confirmation by SEED Resort staff. Aria supports multilingual conversations and can escalate complex requests to the human concierge team. Prices and live availability are not listed in the guest materials.",
  },
  {
    id: "rooms",
    title: "Rooms and accommodations",
    source: "SEED Resort website · Room showcase",
    content: "Lotus View Suite: floor-to-ceiling curved glass overlooking the central waterway; listed for 2 guests. Marina Overwater Villa: floating experience connected to the beachside dock; listed for 2 guests. Forest Canopy Room: elevated within the tropical treeline; listed for 2 guests. Sports Courtside Room: balcony views of the football pitch and tennis courts; listed for 3 guests. Equestrian Lodge: beside the stables with paddock views; listed for 4 guests. The room showcase lists Smart Glass, Biometric Entry, Ambient AI Speakers, and real-time Air Quality Monitoring as resort room features. No room rates or live availability are provided.",
  },
  {
    id: "activities",
    title: "Sports and activities",
    source: "SEED Resort website · Sports and adventure",
    content: "Activities listed include the AI Karting Track, Football Pitch, Tennis and Padel Courts, Equestrian Center, Marina and Watersports, Circular Waterway Light Show, STEM Kids Zone, and Infinity Pool and Beach. The marina section mentions boat rentals, jet skis, snorkeling, paddleboards, and guided tours. The website describes a nightly AI light show on the circular waterway. It does not provide opening times, prices, or live booking availability.",
  },
  {
    id: "dining-services",
    title: "Dining and guest services",
    source: "SEED Resort website · Resort features",
    content: "SEED Resort describes a farm-to-table restaurant, waterfront dining, a rooftop bar, an international buffet, and 24-hour in-room dining. The farm-to-table restaurant uses an AI Menu Planner driven by greenhouse harvest information. The website also lists spa and wellness treatments, airport transfers, housekeeping, laundry, and in-room dining as guest-service request categories. Specific menus, prices, and appointment availability are not provided.",
  },
  {
    id: "sustainability",
    title: "Sustainability",
    source: "SEED Resort website · Sustainability",
    content: "The resort describes a microgrid combining solar parking canopies and on-site wind turbines, AI power routing, rainwater harvesting, greywater recycling, biophilic architecture, a zero-waste kitchen, and greenhouse farms. The website states the resort uses 100% renewable energy and reports 60% water recycling. These are claims from the resort website, not independently verified measurements.",
  },
];

const STOP_WORDS = new Set([
  "about", "after", "are", "can", "could", "does", "for", "from", "have",
  "how", "into", "is", "its", "me", "my", "of", "please", "tell", "the",
  "there", "what", "when", "where", "which", "with", "would", "you",
]);

function tokenize(value: string): string[] {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .match(/[\p{L}\p{N}]{2,}/gu) ?? [];
}

export function searchAriaKnowledge(query: string, limit = 4): AriaKnowledgeDocument[] {
  const terms = [...new Set(tokenize(query).filter((term) => !STOP_WORDS.has(term)))];
  if (!terms.length) return [];

  return ARIA_KNOWLEDGE_DOCUMENTS
    .map((document) => {
      const searchable = `${document.title} ${document.content}`.toLowerCase();
      const score = terms.reduce((total, term) => {
        const matches = searchable.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"));
        return total + (matches?.length ?? 0);
      }, 0);
      return { document, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ document }) => document);
}

export function formatAriaKnowledgeInstructions(documents: AriaKnowledgeDocument[]): string {
  if (!documents.length) {
    return "No matching resort source material was found. Do not guess resort-specific facts; explain that the information is not in the available guest materials and offer to send a request to the concierge.";
  }
  return [
    "Verified resort source material follows. Base resort-specific factual answers only on these excerpts.",
    "Do not invent prices, opening hours, policies, or live availability. If a detail is absent, say so and offer a concierge request.",
    ...documents.map((document) => `Source: ${document.source} (${document.title})\n${document.content}`),
  ].join("\n\n");
}
