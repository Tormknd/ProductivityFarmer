export const calcLevel = (totalXp: number) => {
  const level = Math.floor(Math.sqrt(totalXp / 100));
  const nextLevelXp = (level + 1) ** 2 * 100;
  return { level, nextLevelXp };
}; 