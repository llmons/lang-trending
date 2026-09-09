export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getPassYear = () => {
    const fomatter = Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const now = new Date();
    now.setFullYear(now.getFullYear() - 1); // past year
    return fomatter.format(now).replace(/\//g, "-");
};
