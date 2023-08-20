/**
 * Calculates the Weighted Moving Average (WMA) of a series.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the WMA.
 * @returns {number[]} - The WMA values.
 */
export function wma(series, window) {
  let weights = [];
  for (let i = 0; i < window; i++) {
    weights.push(i + 1);
  }
  let result = [];
  for (let i = 0, len = series.length; i < len; i++) {
    let j = i + 1 - window;
    if (j < 0) {
      result.push(null);
      continue;
    }
    let slice = series.slice(j, i + 1);
    let weighted = slice.map((value, index) => value * weights[index]);
    let sum_weights = weights.reduce((acc, value) => acc + value);
    result.push(weighted.reduce((acc, value) => acc + value) / sum_weights);
  }
  return result;
}

/**
 * Calculates the mean (average) of a series.
 * @param {number[]} series - The input series.
 * @returns {number} - The mean of the series.
 */
export function mean(series) {
  let sum = 0;
  for (let i = 0; i < series.length; i++) {
    sum += series[i];
  }
  return sum / series.length;
}
