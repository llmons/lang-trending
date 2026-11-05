/**
 * The curated catalog of languages tracked by the index.
 *
 * Per the project positioning, only common / mainstream programming
 * languages are included. Niche, esoteric, or non-general-purpose
 * languages are intentionally out of scope.
 */

export const LANGUAGE_CATEGORIES = {
  general: { id: "general", label: "General-purpose" },
  web: { id: "web", label: "Web & markup" },
  data: { id: "data", label: "Data & science" },
  systems: { id: "systems", label: "Systems & scripting" },
} as const

export type CategoryId = keyof typeof LANGUAGE_CATEGORIES

export interface LanguageMeta {
  /** Identifier used in the GitHub search `language:` qualifier. */
  id: string
  /** Human-readable display name. */
  name: string
  /** Brand color (GitHub Linguist color), used for identity swatches. */
  color: string
  category: CategoryId
  /** One-line description of the language's typical use. */
  blurb: string
}

export const LANGUAGE_CATALOG: readonly LanguageMeta[] = [
  {
    id: "JavaScript",
    name: "JavaScript",
    color: "#f1e05a",
    category: "web",
    blurb: "The language of the browser and the world's largest npm ecosystem.",
  },
  {
    id: "TypeScript",
    name: "TypeScript",
    color: "#3178c6",
    category: "general",
    blurb: "JavaScript with static types, the default for large frontends.",
  },
  {
    id: "Python",
    name: "Python",
    color: "#3572A5",
    category: "general",
    blurb: "The workhorse of data science, scripting, and backends.",
  },
  {
    id: "Java",
    name: "Java",
    color: "#b07219",
    category: "general",
    blurb: "The backbone of enterprise systems and Android for decades.",
  },
  {
    id: "C",
    name: "C",
    color: "#555555",
    category: "general",
    blurb: "The lingua franca of operating systems and embedded devices.",
  },
  {
    id: "C++",
    name: "C++",
    color: "#f34b7d",
    category: "general",
    blurb: "Performance-critical systems, games, and native tooling.",
  },
  {
    id: "C#",
    name: "C#",
    color: "#178600",
    category: "general",
    blurb: "Microsoft's flagship language for .NET and game engines.",
  },
  {
    id: "Go",
    name: "Go",
    color: "#00ADD8",
    category: "general",
    blurb: "Concurrent services and cloud infrastructure, by Google.",
  },
  {
    id: "Rust",
    name: "Rust",
    color: "#dea584",
    category: "general",
    blurb: "Memory safety without a garbage collector.",
  },
  {
    id: "PHP",
    name: "PHP",
    color: "#4F5D95",
    category: "general",
    blurb: "Still the engine behind a large share of the web.",
  },
  {
    id: "Ruby",
    name: "Ruby",
    color: "#701516",
    category: "general",
    blurb: "Developer happiness, popularized by Rails.",
  },
  {
    id: "Swift",
    name: "Swift",
    color: "#F05138",
    category: "general",
    blurb: "Apple's modern language for iOS, macOS, and beyond.",
  },
  {
    id: "Kotlin",
    name: "Kotlin",
    color: "#A97BFF",
    category: "general",
    blurb: "The pragmatic JVM language and Android's preferred choice.",
  },
  {
    id: "Dart",
    name: "Dart",
    color: "#00B4AB",
    category: "general",
    blurb: "The language behind Flutter's cross-platform apps.",
  },
  {
    id: "Scala",
    name: "Scala",
    color: "#c22d40",
    category: "general",
    blurb: "Functional programming on the JVM, powering big data stacks.",
  },
  {
    id: "Haskell",
    name: "Haskell",
    color: "#5e5086",
    category: "general",
    blurb: "The reference point for purely functional programming.",
  },
  {
    id: "Elixir",
    name: "Elixir",
    color: "#6e4a7e",
    category: "general",
    blurb: "Fault-tolerant concurrency on the Erlang VM.",
  },
  {
    id: "Objective-C",
    name: "Objective-C",
    color: "#438eff",
    category: "general",
    blurb: "The original language of the Apple platform.",
  },
  {
    id: "Groovy",
    name: "Groovy",
    color: "#4298b8",
    category: "general",
    blurb: "Dynamic scripting on the JVM, home of Gradle builds.",
  },
  {
    id: "Perl",
    name: "Perl",
    color: "#0298c3",
    category: "general",
    blurb: "The veteran of text processing and system scripting.",
  },
  {
    id: "HTML",
    name: "HTML",
    color: "#e34c26",
    category: "web",
    blurb: "The structure of every page on the web.",
  },
  {
    id: "CSS",
    name: "CSS",
    color: "#563d7c",
    category: "web",
    blurb: "The styling layer that makes the web look the way it does.",
  },
  {
    id: "Vue",
    name: "Vue",
    color: "#41b883",
    category: "web",
    blurb: "The approachable progressive JavaScript framework.",
  },
  {
    id: "R",
    name: "R",
    color: "#198CE7",
    category: "data",
    blurb: "The statistician's language of choice.",
  },
  {
    id: "Julia",
    name: "Julia",
    color: "#a270ba",
    category: "data",
    blurb: "High-performance numerical computing without two languages.",
  },
  {
    id: "MATLAB",
    name: "MATLAB",
    color: "#e16737",
    category: "data",
    blurb: "Numerical computing for engineering and academia.",
  },
  {
    id: "Shell",
    name: "Shell",
    color: "#89e051",
    category: "systems",
    blurb: "The glue that holds every system together.",
  },
  {
    id: "Assembly",
    name: "Assembly",
    color: "#6E4C13",
    category: "systems",
    blurb: "One step above machine code, still everywhere underneath.",
  },
  {
    id: "Lua",
    name: "Lua",
    color: "#000080",
    category: "systems",
    blurb: "The lightweight embeddable scripting language.",
  },
] as const
