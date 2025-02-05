export const parseJSON = (data: string | null | undefined, defaultValue: any = []) => {
    if (!data) return defaultValue;
    try {
        return JSON.parse(data);
    } catch {
        return defaultValue;
    }
}; 