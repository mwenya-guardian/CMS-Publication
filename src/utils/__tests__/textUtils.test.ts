import { capitalizeWords, capitalizeFirst, toTitleCase } from '../textUtils';

describe('textUtils', () => {
  describe('capitalizeWords', () => {
    it('should capitalize the first letter of every word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('john doe smith')).toBe('John Doe Smith');
      expect(capitalizeWords('single')).toBe('Single');
    });

    it('should handle empty strings', () => {
      expect(capitalizeWords('')).toBe('');
    });

    it('should handle uppercase input', () => {
      expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
    });

    it('should handle mixed case input', () => {
      expect(capitalizeWords('hELLo WoRLd')).toBe('Hello World');
    });

    it('should handle single character words', () => {
      expect(capitalizeWords('a b c')).toBe('A B C');
    });

    it('should handle multiple spaces', () => {
      expect(capitalizeWords('hello   world')).toBe('Hello   World');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize only the first letter', () => {
      expect(capitalizeFirst('hello world')).toBe('Hello world');
      expect(capitalizeFirst('john doe')).toBe('John doe');
      expect(capitalizeFirst('single')).toBe('Single');
    });

    it('should handle empty strings', () => {
      expect(capitalizeFirst('')).toBe('');
    });

    it('should handle uppercase input', () => {
      expect(capitalizeFirst('HELLO WORLD')).toBe('Hello world');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('john doe smith')).toBe('John Doe Smith');
      expect(toTitleCase('USA today')).toBe('USA Today');
    });

    it('should handle empty strings', () => {
      expect(toTitleCase('')).toBe('');
    });

    it('should handle uppercase input', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    });
  });
});
