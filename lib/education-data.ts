// ─────────────────────────────────────────────────
// EcoToken — Education Hub Data
// ─────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  questions: QuizQuestion[];
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  category: string;
  emoji: string;
}

// ── Token reward thresholds ─────────────────────

export const QUIZ_REWARDS = {
  PERFECT: { minPercent: 100, tokens: 15, label: "Perfect Score!" },
  GREAT: { minPercent: 80, tokens: 10, label: "Great Job!" },
  GOOD: { minPercent: 60, tokens: 2, label: "Good Effort!" },
  TRY_AGAIN: { minPercent: 0, tokens: 0, label: "Keep Learning!" },
} as const;

export const VIDEO_REWARD_TOKENS = 8;

export function getQuizReward(score: number, total: number) {
  const percent = Math.round((score / total) * 100);
  if (percent >= 100) return QUIZ_REWARDS.PERFECT;
  if (percent >= 80) return QUIZ_REWARDS.GREAT;
  if (percent >= 60) return QUIZ_REWARDS.GOOD;
  return QUIZ_REWARDS.TRY_AGAIN;
}

// ── Quiz Data ───────────────────────────────────

export const QUIZZES: Quiz[] = [
  {
    id: "recycling-basics",
    title: "Recycling Basics",
    description: "Test your knowledge of everyday recycling practices and common recyclable materials.",
    emoji: "♻️",
    category: "Recycling",
    questions: [
      {
        id: "rb-1",
        question: "Which of these items should NOT go in the recycling bin?",
        options: ["Aluminum cans", "Greasy pizza boxes", "Newspaper", "Plastic bottles"],
        correctIndex: 1,
        explanation: "Greasy pizza boxes contaminate other recyclables. The grease cannot be separated from the paper fibers during recycling.",
      },
      {
        id: "rb-2",
        question: "What does the number inside the recycling symbol on plastics indicate?",
        options: ["How many times it can be recycled", "The type of plastic resin", "The recycling priority level", "The year it was manufactured"],
        correctIndex: 1,
        explanation: "The resin identification code (1-7) tells you what type of plastic the item is made from, which determines how it should be recycled.",
      },
      {
        id: "rb-3",
        question: "How many times can aluminum be recycled?",
        options: ["Once", "5 times", "10 times", "Infinitely"],
        correctIndex: 3,
        explanation: "Aluminum can be recycled indefinitely without losing quality. Recycling aluminum saves 95% of the energy needed to make new aluminum.",
      },
      {
        id: "rb-4",
        question: "Should you rinse containers before recycling them?",
        options: ["No, it wastes water", "Yes, a quick rinse is recommended", "Only glass containers", "Only if they smell bad"],
        correctIndex: 1,
        explanation: "A quick rinse removes food residue that can contaminate other recyclables. It doesn't need to be spotless — just reasonably clean.",
      },
      {
        id: "rb-5",
        question: "What percentage of plastic waste has ever been recycled globally?",
        options: ["About 50%", "About 30%", "About 9%", "About 75%"],
        correctIndex: 2,
        explanation: "Only about 9% of all plastic ever produced has been recycled. This highlights the importance of reducing plastic use and improving recycling infrastructure.",
      },
      {
        id: "rb-6",
        question: "Which material takes the longest to decompose in a landfill?",
        options: ["Paper (2-6 weeks)", "Aluminum can (200 years)", "Glass bottle (1 million years)", "Plastic bag (500 years)"],
        correctIndex: 2,
        explanation: "Glass is extremely durable and can take up to 1 million years to decompose in a landfill, making recycling it especially important.",
      },
    ],
  },
  {
    id: "climate-change",
    title: "Climate Change 101",
    description: "How much do you know about the causes and effects of climate change?",
    emoji: "🌡️",
    category: "Climate",
    questions: [
      {
        id: "cc-1",
        question: "What is the primary greenhouse gas responsible for global warming?",
        options: ["Oxygen", "Carbon dioxide (CO₂)", "Nitrogen", "Hydrogen"],
        correctIndex: 1,
        explanation: "CO₂ is the most significant greenhouse gas produced by human activities, primarily through burning fossil fuels.",
      },
      {
        id: "cc-2",
        question: "What does the Paris Agreement aim to limit global temperature rise to?",
        options: ["1°C above pre-industrial levels", "1.5°C above pre-industrial levels", "3°C above pre-industrial levels", "5°C above pre-industrial levels"],
        correctIndex: 1,
        explanation: "The Paris Agreement aims to limit warming to 1.5°C above pre-industrial levels, which scientists say is crucial to avoiding the worst climate impacts.",
      },
      {
        id: "cc-3",
        question: "Which sector produces the most greenhouse gas emissions globally?",
        options: ["Agriculture", "Transportation", "Energy production", "Manufacturing"],
        correctIndex: 2,
        explanation: "Energy production (electricity and heat) is the largest source of global emissions, accounting for about 25% of the total.",
      },
      {
        id: "cc-4",
        question: "What is a 'carbon footprint'?",
        options: ["A fossil found in carbon rock", "Total greenhouse gases caused by a person or organization", "The area of land used for fossil fuel extraction", "A type of carbon dating method"],
        correctIndex: 1,
        explanation: "A carbon footprint measures the total amount of greenhouse gases generated by our actions, expressed in CO₂ equivalent.",
      },
      {
        id: "cc-5",
        question: "How much has the global average temperature risen since pre-industrial times?",
        options: ["About 0.3°C", "About 1.1°C", "About 2.5°C", "About 5°C"],
        correctIndex: 1,
        explanation: "As of recent measurements, the Earth's average temperature has risen by approximately 1.1°C since the late 1800s.",
      },
    ],
  },
  {
    id: "waste-sorting",
    title: "Waste Sorting Pro",
    description: "Can you sort waste correctly? Test your waste management skills.",
    emoji: "🗑️",
    category: "Waste",
    questions: [
      {
        id: "ws-1",
        question: "Where should used batteries go?",
        options: ["Regular trash", "Recycling bin", "Hazardous waste collection", "Compost"],
        correctIndex: 2,
        explanation: "Batteries contain toxic chemicals and heavy metals. They must go to designated hazardous waste or battery recycling collection points.",
      },
      {
        id: "ws-2",
        question: "Can you recycle a plastic bag in your curbside recycling bin?",
        options: ["Yes, all plastics are recyclable", "No, they jam recycling machinery", "Only if they're clean", "Only colored bags"],
        correctIndex: 1,
        explanation: "Plastic bags tangle in sorting machinery at recycling facilities. Return them to grocery store drop-off bins instead.",
      },
      {
        id: "ws-3",
        question: "Which of these is compostable?",
        options: ["Styrofoam cups", "Egg shells", "Plastic straws", "Aluminum foil"],
        correctIndex: 1,
        explanation: "Egg shells are rich in calcium and break down well in compost. They add valuable minerals to the finished compost.",
      },
      {
        id: "ws-4",
        question: "What should you do with old electronics like phones and laptops?",
        options: ["Throw in regular trash", "Put in recycling bin", "Take to an e-waste recycling center", "Bury them"],
        correctIndex: 2,
        explanation: "E-waste contains valuable recoverable materials and toxic substances. Specialized e-waste facilities safely extract and recycle components.",
      },
      {
        id: "ws-5",
        question: "Are paper coffee cups recyclable?",
        options: ["Yes, they're made of paper", "No, the plastic lining makes them non-recyclable", "Only if you remove the lid", "Only the sleeve is recyclable"],
        correctIndex: 1,
        explanation: "Most paper coffee cups have a thin plastic polyethylene lining that makes them difficult to recycle in standard facilities.",
      },
      {
        id: "ws-6",
        question: "What does 'contamination' mean in recycling?",
        options: ["Mixing clean recyclables with non-recyclable or dirty items", "Using too many chemicals", "Overfilling the bin", "Recycling too frequently"],
        correctIndex: 0,
        explanation: "Contamination occurs when non-recyclable materials or food-soiled items are mixed in, which can cause entire batches to be sent to landfill.",
      },
    ],
  },
  {
    id: "sustainable-living",
    title: "Sustainable Living",
    description: "How green is your lifestyle? Learn tips for everyday sustainability.",
    emoji: "🌿",
    category: "Lifestyle",
    questions: [
      {
        id: "sl-1",
        question: "Which uses less energy: washing clothes in cold or hot water?",
        options: ["Hot water", "Cold water", "They use the same energy", "It depends on the fabric"],
        correctIndex: 1,
        explanation: "About 90% of the energy used by washing machines goes to heating water. Cold water washing saves significant energy and works well for most loads.",
      },
      {
        id: "sl-2",
        question: "What is the most effective way to reduce your environmental impact?",
        options: ["Buy carbon offsets", "Reduce consumption overall", "Switch to paper bags", "Drive an electric car"],
        correctIndex: 1,
        explanation: "The most impactful action is simply consuming less. Reduce first, then reuse, and recycle as a last resort — the 3 R's hierarchy.",
      },
      {
        id: "sl-3",
        question: "How much food is wasted globally each year?",
        options: ["About 10%", "About 20%", "About 33%", "About 5%"],
        correctIndex: 2,
        explanation: "Roughly one-third of all food produced globally is lost or wasted, contributing to about 8-10% of global greenhouse gas emissions.",
      },
      {
        id: "sl-4",
        question: "Which daily habit saves the most water?",
        options: ["Turning off tap while brushing teeth", "Taking shorter showers", "Fixing leaky faucets", "All of the above"],
        correctIndex: 3,
        explanation: "All these habits contribute to significant water savings. A leaky faucet alone can waste over 3,000 gallons per year.",
      },
      {
        id: "sl-5",
        question: "What does 'fast fashion' refer to?",
        options: ["Quick delivery shipping", "Cheap, rapidly produced clothing following trends", "Athletic wear", "Fashion shows with short runways"],
        correctIndex: 1,
        explanation: "Fast fashion produces cheap clothing quickly to match trends, leading to massive waste — the fashion industry produces about 10% of global CO₂ emissions.",
      },
    ],
  },
];

// ── Video Data ──────────────────────────────────

export const VIDEOS: VideoItem[] = [
  {
    id: "vid-sorting-guide",
    title: "Waste Sorting Guide — What Goes Where?",
    description: "A quick walkthrough on what's recyclable, compostable, and trash. Learn the basics of sorting your waste correctly.",
    youtubeId: "XP0ZNyv8TXY",
    duration: "2:30",
    category: "How to Sort",
    emoji: "📋",
  },
  {
    id: "vid-sort-at-home",
    title: "How to Sort Waste at Home",
    description: "Confused about which items go in each bin? Easy tips for you and your family to sort waste at home correctly.",
    youtubeId: "M7hI3sjyw8M",
    duration: "3:15",
    category: "How to Sort",
    emoji: "🏠",
  },
  {
    id: "vid-garbage-sorting-101",
    title: "Garbage Sorting 101 — A Professor Explains",
    description: "University of Toronto ecology professor explains how to properly sort common household waste items.",
    youtubeId: "AWr-Y8c2_5o",
    duration: "5:40",
    category: "How to Sort",
    emoji: "🎓",
  },
  {
    id: "vid-ubc-sort-waste",
    title: "How to Sort Your Waste Correctly on Campus",
    description: "UBC Sustainability shows how to separate waste into food scraps, containers, paper, and garbage at campus stations.",
    youtubeId: "UhqP9M3-51w",
    duration: "2:10",
    category: "How to Sort",
    emoji: "🏫",
  },
  {
    id: "vid-improper-disposal-consequences",
    title: "Consequences of Improper Waste Disposal",
    description: "What happens when hazardous waste isn't handled properly? Learn about soil contamination, water pollution, and health risks.",
    youtubeId: "bd5NxmsAh4k",
    duration: "6:20",
    category: "Dangers",
    emoji: "⚠️",
  },
  {
    id: "vid-improper-disposal-effects",
    title: "Improper Waste Disposal — Effects & Solutions",
    description: "See the real-world environmental damage caused by dumping waste incorrectly and what solutions exist.",
    youtubeId: "AUN_5fvgKjA",
    duration: "4:50",
    category: "Dangers",
    emoji: "🚯",
  },
  {
    id: "vid-recycling-facility",
    title: "Inside a Recycling Sorting Facility",
    description: "Follow the process from curbside collection to sorted materials. See why proper sorting at home matters so much.",
    youtubeId: "3Lzsu8SXaWY",
    duration: "4:30",
    category: "How it Works",
    emoji: "🏭",
  },
  {
    id: "vid-veolia-sorting",
    title: "Waste Sorting & Recycling Explained in 3 Minutes",
    description: "A clear, animated explainer on circular economy, why waste sorting matters, and how recycling prevents environmental harm.",
    youtubeId: "g_ajkE77Nik",
    duration: "3:00",
    category: "How it Works",
    emoji: "🔄",
  },
];
