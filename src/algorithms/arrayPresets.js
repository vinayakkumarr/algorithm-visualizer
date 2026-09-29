/**
 * arrayPresets.js — Preset array generators & custom input parsing utilities.
 */

export const PRESETS = {
  random: (n = 20) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10),

  sorted: (n = 20) =>
    Array.from({ length: n }, (_, i) =>
      Math.round(10 + (89 / Math.max(n - 1, 1)) * i)
    ),

  reverseSorted: (n = 20) =>
    Array.from({ length: n }, (_, i) =>
      Math.round(99 - (89 / Math.max(n - 1, 1)) * i)
    ),

  nearSorted: (n = 20) => {
    const arr = Array.from({ length: n }, (_, i) =>
      Math.round(10 + (89 / Math.max(n - 1, 1)) * i)
    );
    // Swap ~10% adjacent pairs
    const swaps = Math.max(1, Math.floor(n * 0.1));
    for (let k = 0; k < swaps; k++) {
      const a = Math.floor(Math.random() * (n - 1));
      [arr[a], arr[a + 1]] = [arr[a + 1], arr[a]];
    }
    return arr;
  },

  duplicates: (n = 20) => {
    const pool = [15, 30, 45, 60, 75, 90];
    return Array.from({ length: n }, () => pool[Math.floor(Math.random() * pool.length)]);
  },
};

/**
 * Parses and validates user input for custom array.
 * Supports comma, space, newline, or tab delimiters.
 *
 * @param {string} inputStr - Raw user input
 * @param {number} minLen   - Minimum element count (default 3)
 * @param {number} maxLen   - Maximum element count (default 80)
 * @returns {{ values: number[] | null, error: string | null, stats?: { count: number, min: number, max: number } }}
 */
export function parseCustomArray(inputStr, minLen = 3, maxLen = 80) {
  if (typeof inputStr !== "string") {
    return { values: null, error: "Please enter numbers separated by commas or spaces." };
  }

  const trimmed = inputStr.trim();
  if (!trimmed) {
    return { values: null, error: "Input is empty. Please enter numbers separated by commas or spaces." };
  }

  // Split by commas, whitespace, newlines, or tabs
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);

  if (tokens.length < minLen) {
    return {
      values: null,
      error: `Array must have at least ${minLen} elements (currently entered: ${tokens.length}).`,
    };
  }

  if (tokens.length > maxLen) {
    return {
      values: null,
      error: `Array size exceeds maximum limit of ${maxLen} elements (currently entered: ${tokens.length}).`,
    };
  }

  const values = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const num = Number(token);

    if (isNaN(num) || !Number.isFinite(num)) {
      return {
        values: null,
        error: `"${token}" at item #${i + 1} is not a valid number.`,
      };
    }

    if (!Number.isInteger(num)) {
      return {
        values: null,
        error: `Decimals are not supported (${token} at item #${i + 1}). Please use whole integers.`,
      };
    }

    if (num < 1 || num > 999) {
      return {
        values: null,
        error: `Value ${num} at item #${i + 1} is out of bounds. Elements must be between 1 and 999.`,
      };
    }

    values.push(num);
  }

  return {
    values,
    error: null,
    stats: {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    },
  };
}
