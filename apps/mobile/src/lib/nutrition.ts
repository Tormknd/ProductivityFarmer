/**
 * Helper function to format nutrition values (remove unnecessary decimals)
 * @param value - The nutrition value to format
 * @returns Formatted string representation
 */
export const formatNutritionValue = (value: number): string => {
  if (value === 0) return '0';
  if (value < 1) return value.toFixed(1);
  return Math.round(value).toString();
};

/**
 * Helper function to format calories specifically
 * @param value - The calorie value to format
 * @returns Formatted calorie string
 */
export const formatCalories = (value: number): string => {
  return `${formatNutritionValue(value)} kcal`;
};

/**
 * Helper function to format macros with unit
 * @param value - The macro value to format
 * @param unit - The unit (default: 'g')
 * @returns Formatted macro string
 */
export const formatMacro = (value: number, unit: string = 'g'): string => {
  return `${formatNutritionValue(value)}${unit}`;
}; 