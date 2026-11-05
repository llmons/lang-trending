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
  /**
   * Identifier used in the GitHub search `language:` qualifier. Multi-word
   * names (e.g. "Visual Basic .NET") must be double-quoted in the query —
   * the query builder in `data.ts` handles that.
   */
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
    id: "Zig",
    name: "Zig",
    color: "#ec915c",
    category: "general",
    blurb: "A modern systems language and safer successor to C.",
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
    id: "Erlang",
    name: "Erlang",
    color: "#B83998",
    category: "general",
    blurb:
      "Fault-tolerant concurrency, the backbone of telecom infrastructure.",
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
    id: "VBA",
    name: "VBA",
    color: "#867db1",
    category: "general",
    blurb: "Office automation and macros — the glue of business workflows.",
  },
  {
    id: "VBScript",
    name: "VBScript",
    color: "#15dcdc",
    category: "systems",
    blurb: "Lightweight Windows scripting, the elder sibling of VBA.",
  },
  {
    id: "Visual Basic 6.0",
    name: "Visual Basic 6.0",
    color: "#2c6353",
    category: "general",
    blurb:
      "The classic Windows desktop language still running legacy business apps.",
  },
  {
    id: "Visual Basic .NET",
    name: "Visual Basic .NET",
    color: "#945db7",
    category: "general",
    blurb: "Microsoft's modern reincarnation of BASIC on the .NET runtime.",
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
    id: "Svelte",
    name: "Svelte",
    color: "#ff3e00",
    category: "web",
    blurb: "A compiler-driven UI framework with no virtual DOM.",
  },
  {
    id: "Astro",
    name: "Astro",
    color: "#ff5a03",
    category: "web",
    blurb:
      "The content-first web framework that ships zero JavaScript by default.",
  },
  {
    id: "Markdown",
    name: "Markdown",
    color: "#083fa1",
    category: "web",
    blurb: "The plain-text markup that documents the whole internet.",
  },
  {
    id: "R",
    name: "R",
    color: "#198CE7",
    category: "data",
    blurb: "The statistician's language of choice.",
  },
  {
    id: "MATLAB",
    name: "MATLAB",
    color: "#e16737",
    category: "data",
    blurb: "Numerical computing for engineering and academia.",
  },
  {
    id: "SQL",
    name: "SQL",
    color: "#e38c00",
    category: "data",
    blurb: "The universal language of databases.",
  },
  {
    id: "Jupyter Notebook",
    name: "Jupyter Notebook",
    color: "#DA5B0B",
    category: "data",
    blurb: "The interactive notebook format of data science.",
  },
  {
    id: "Fortran",
    name: "Fortran",
    color: "#4d41b1",
    category: "data",
    blurb: "The original scientific computing language, still fast at seventy.",
  },
  {
    id: "Shell",
    name: "Shell",
    color: "#89e051",
    category: "systems",
    blurb: "The glue that holds every system together.",
  },
  {
    id: "PowerShell",
    name: "PowerShell",
    color: "#012456",
    category: "systems",
    blurb: "Windows' object-oriented shell and automation language.",
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
