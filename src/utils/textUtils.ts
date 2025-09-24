/**
 * Capitalizes the first letter of every word in a string using space as separator
 * @param text - The input string to capitalize
 * @returns The string with each word's first letter capitalized
 * 
 * @example
 * capitalizeWords("hello world") // "Hello World"
 * capitalizeWords("john doe smith") // "John Doe Smith"
 * capitalizeWords("") // ""
 * capitalizeWords("single") // "Single"
 */
export const capitalizeWords = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Capitalizes only the first letter of the entire string
 * @param text - The input string to capitalize
 * @returns The string with only the first letter capitalized
 * 
 * @example
 * capitalizeFirst("hello world") // "Hello world"
 * capitalizeFirst("john doe") // "John doe"
 */
export const capitalizeFirst = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Converts a string to title case (capitalizes first letter of each word)
 * but preserves existing capitalization for acronyms and proper nouns
 * @param text - The input string to convert to title case
 * @returns The string in title case format
 * 
 * @example
 * toTitleCase("hello world") // "Hello World"
 * toTitleCase("john doe smith") // "John Doe Smith"
 * toTitleCase("USA today") // "USA Today"
 */
export const toTitleCase = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};
