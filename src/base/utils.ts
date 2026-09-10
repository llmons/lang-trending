export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface TimeRange {
    past: string;
    current: string;
}

export const getTimeRange = (): TimeRange => {
    const fomatter = Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const current = new Date();
    const past = structuredClone(current);
    past.setFullYear(past.getFullYear() - 1); // past year

    return {
        past: fomatter.format(past).replace(/\//g, "-"),
        current: fomatter.format(current).replace(/\//g, "-")
    };
};
