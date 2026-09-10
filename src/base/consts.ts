interface Language {
    alias: string;
    color: string;
    count: number;
    name: string;
}

export const languages: Language[] = [
    { name: "c", color: "#555555", count: 0, alias: "C" },
    { name: "csharp", color: "#7355dd", count: 0, alias: "C#" },
    { name: "cplusplus", color: "#f34b7d", count: 0, alias: "C++" },
    { name: "css", color: "#663399", count: 0, alias: "CSS" },
    { name: "dart", color: "#00B4AB", count: 0, alias: "Dart" },
    { name: "go", color: "#00ADD8", count: 0, alias: "Go" },
    { name: "html", color: "#e34c26", count: 0, alias: "HTML" },
    { name: "java", color: "#b07219", count: 0, alias: "Java" },
    {
        name: "javascript",
        color: "#f1e05a",
        count: 0,
        alias: "JavaScript",
    },
    { name: "kotlin", color: "#A97BFF", count: 0, alias: "Kotlin" },
    { name: "lua", color: "#000080", count: 0, alias: "Lua" },
    { name: "matlab", color: "#e16737", count: 0, alias: "Matlab" },
    {
        name: "objectivec",
        color: "#438eff",
        count: 0,
        alias: "Objective-C",
    },
    { name: "perl", color: "#0298c3", count: 0, alias: "Perl" },
    { name: "php", color: "#4F5D95", count: 0, alias: "PHP" },
    {
        name: "powershell",
        color: "#012456",
        count: 0,
        alias: "PowerShell",
    },
    { name: "python", color: "#3572A5", count: 0, alias: "Python" },
    { name: "ruby", color: "#701516", count: 0, alias: "Ruby" },
    { name: "rust", color: "#dea584", count: 0, alias: "Rust" },
    { name: "shell", color: "#89e051", count: 0, alias: "Shell" },
    { name: "swift", color: "#F05138", count: 0, alias: "Swift" },
    {
        name: "typescript",
        color: "#3178c6",
        count: 0,
        alias: "TypeScript",
    },
    { name: "zig", color: "#ec915c", count: 0, alias: "Zig" },
];
