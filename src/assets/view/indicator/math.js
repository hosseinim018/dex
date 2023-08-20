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

/**
 * Calculates the standard deviation (SD) of a series.
 * @param {number[]} series - The input series.
 * @returns {number} - The standard deviation of the series.
 */
export function sd(series) {
  let E = mean(series);
  let E2 = mean(pointwise((x) => x * x, series));
  return Math.sqrt(E2 - E * E);
}

/**
 * Calculates the covariance between two series.
 * @param {number[]} f - The first input series.
 * @param {number[]} g - The second input series.
 * @returns {number} - The covariance between the two series.
 */
export function cov(f, g) {
  let Ef = mean(f),
    Eg = mean(g);
  let Efg = mean(pointwise((a, b) => a * b, f, g));
  return Efg - Ef * Eg;
}

/**
 * Calculates the correlation coefficient between two series.
 * @param {number[]} f - The first input series.
 * @param {number[]} g - The second input series.
 * @returns {number} - The correlation coefficient between the two series.
 */
export function cor(f, g) {
  let Ef = mean(f),
    Eg = mean(g);
  let Ef2 = mean(pointwise((a) => a * a, f));
  let Eg2 = mean(pointwise((a) => a * a, g));
  let Efg = mean(pointwise((a, b) => a * b, f, g));
  return (Efg - Ef * Eg) / Math.sqrt((Ef2 - Ef * Ef) * (Eg2 - Eg * Eg));
}

/**
 * Calculates the Mean Absolute Deviation (MAD) of a series.
 * @param {number[]} array - The input series.
 * @returns {number} - The MAD of the series.
 */
export function mad(array) {
  return mae(array, new Array(array.length).fill(mean(array)));
}

/**
 * Applies a pointwise operation to one or more series.
 * @param {function} operation - The pointwise operation.
 * @param {...number[]} serieses - The input serieses.
 * @returns {number[]} - The result of the pointwise operation.
 */
export function pointwise(operation, ...serieses) {
  let result = [];
  for (let i = 0, len = serieses[0].length; i < len; i++) {
    let iseries = (i) => serieses.map((x) => x[i]);
    result[i] = operation(...iseries(i));
  }
  return result;
}

/**
 * Applies a rolling operation to a series.
 * @param {function} operation - The rolling operation.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the rolling operation.
 * @returns {number[]} - The result of the rolling operation.
 */
export function rolling(operation, series, window) {
  const result = [];
  for (let i = 0, len = series.length; i < len; i++) {
    const startIndex = Math.max(i + 1 - window, 0);
    const slice = series.slice(startIndex, i + 1);
    result.push(operation(slice));
  }
  return result;
}

/**
 * Calculates the Mean Absolute Error (MAE) between two series.
 * @param {number[]} f - The first input series.
 * @param {number[]} g - The second input series.
 * @returns {number} - The MAE between the two series.
 */
export function mae(f, g) {
  const absDiff = pointwise((a, b) => Math.abs(a - b), f, g);
  return f.length !== g.length ? Infinity : mean(absDiff);
}

/**
 * Calculates the Simple Moving Average (SMA) of a series.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the SMA.
 * @returns {number[]} - The SMA values.
 */
export function sma(series, window) {
  return rolling((s) => mean(s), series, window);
}

/**
 * Calculates the Exponential Moving Average (EMA) of a series.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the EMA.
 * @param {number} start - The initial value for the EMA.
 * @returns {number[]} - The EMA values.
 */
export function ema(series, window, start) {
  const weight = 2 / (window + 1);
  const ema = [start ? start : mean(series.slice(0, window))];
  for (let i = 1, len = series.length; i < len; i++) {
    ema.push(series[i] * weight + (1 - weight) * ema[i - 1]);
  }
  return ema;
}

/**
 * Calculates the standard deviation (SD) of a series using a rolling window.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the SD.
 * @returns {number[]} - The SD values.
 */
export function stdev(series, window) {
  return rolling((s) => sd(s), series, window);
}

/**
 * Calculates the Mean Absolute Deviation (MAD) of a series using a rolling window.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the MAD.
 * @returns {number[]} - The MAD values.
 */
export function madev(series, window) {
  return rolling((s) => mad(s), series, window);
}

/**
 * Calculates the Exponential Deviation (EXPDEV) of a series using a rolling window.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the EXPDEV.
 * @returns {number[]} - The EXPDEV values.
 */
export function expdev(series, window) {
  const sqrDiff = pointwise((a, b) => (a - b) * (a - b), series, ema(series, window));
  return pointwise((x) => Math.sqrt(x), ema(sqrDiff, window));
}

/**
 * Calculates the Average True Range (ATR) of a series using a rolling window.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the ATR.
 * @returns {number[]} - The ATR values.
 */
export function atr($high, $low, $close, window) {
  const tr = trueRange($high, $low, $close);
  return ema(tr, 2 * window - 1);
}

/**
 * Performs Wilder smoothing on a series using a rolling window.
 * @param {number[]} series - The input series.
 * @param {number} window - The window size for the Wilder smoothing.
 * @returns {number[]} - The smoothed series.
 */
export function wilderSmooth(series, window) {
  const result = new Array(window).fill(NaN);
  result.push(
    series
      .slice(1, window + 1)
      .reduce((sum, item) => sum + item, 0)
  );
  for (let i = window + 1; i < series.length; i++) {
    result.push((1 - 1 / window) * result[i - 1] + series[i]);
  }
  return result;
}

/**
 * Calculates the Typical Price of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @returns {number[]} - The Typical Price values.
 */
export function typicalPrice($high, $low, $close) {
  return pointwise((a, b, c) => (a + b + c) / 3, $high, $low, $close);
}

/**
 * Calculates the True Range (TR) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @returns {number[]} - The TR values.
 */
export function trueRange($high, $low, $close) {
  const tr = [$high[0] - $low[0]];
  for (let i = 1, len = $low.length; i < len; i++) {
    tr.push(
      Math.max(
        $high[i] - $low[i],
        Math.abs($high[i] - $close[i - 1]),
        Math.abs($low[i] - $close[i - 1])
      )
    );
  }
  return tr;
}

/**
 * Calculates the Bollinger Bands (BB) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the BB.
 * @param {number} mult - The multiplier for the standard deviation in the BB.
 * @returns {Object} - The Bollinger Bands values.
 */
export function bb($close, window, mult) {
  const ma = sma($close, window);
  const dev = stdev($close, window);
  const upper = pointwise((a, b) => a + b * mult, ma, dev);
  const lower = pointwise((a, b) => a - b * mult, ma, dev);
  return { lower, middle: ma, upper };
}

/**
 * Calculates the Double Exponential Moving Average (DEMA) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the DEMA.
 * @returns {number[]} - The DEMA values.
 */
export function dema($close, window) {
  const ema1 = ema($close, window);
  return pointwise((a, b) => 2 * a - b, ema1, ema(ema1, window));
}

/**
 * Calculates the Exponential Bollinger Bands (EBB) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the EBB.
 * @param {number} mult - The multiplier for the exponential deviation in the EBB.
 * @returns {Object} - The EBB values.
 */
export function ebb($close, window, mult) {
  const ma = ema($close, window);
  const dev = expdev($close, window);
  const upper = pointwise((a, b) => a + b * mult, ma, dev);
  const lower = pointwise((a, b) => a - b * mult, ma, dev);
  return { lower, middle: ma, upper };
}

/**
 * Calculates the Keltner Channel of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the Keltner channel.
 * @param {number} mult - The multiplier for the Average True Range in the Keltner channel.
 * @returns {Object} - The Keltner Channel values.
 */
export function keltner($high, $low, $close, window, mult) {
  const middle = ema($close, window);
  const upper = pointwise((a, b) => a + mult * b, middle, atr($high, $low, $close, window));
  const lower = pointwise((a, b) => a - mult * b, middle, atr($high, $low, $close, window));
  return { lower, middle, upper };
}
