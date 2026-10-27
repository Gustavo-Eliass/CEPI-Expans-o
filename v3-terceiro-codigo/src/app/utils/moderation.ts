export const BLOCKED = ["idiota","burro","estúpido","imbecil","merda","bosta","cretino","babaca","otário","lixo","inútil"];

export const checkWord = (t: string) => BLOCKED.find(w => t.toLowerCase().includes(w)) ?? null;
