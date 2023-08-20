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

/**
 * Calculates the Parabolic Stop and Reverse (PSAR) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number} stepfactor - The step factor for the PSAR.
 * @param {number} maxfactor - The maximum step factor for the PSAR.
 * @returns {number[]} - The PSAR values.
 */
export function psar($high, $low, stepfactor, maxfactor) {
    let isUp = true;
    let factor = stepfactor;
    let extreme = Math.max($high[0], $high[1]);
    let psar = [$low[0], Math.min($low[0], $low[1])];
    let cursar = psar[1];
    for (let i = 2, len = $high.length; i < len; i++) {
        cursar = cursar + factor * (extreme - cursar);
        if ((isUp && $high[i] > extreme) || (!isUp && $low[i] < extreme)) {
            factor = ((factor <= maxfactor) ? factor + stepfactor : maxfactor);
            extreme = (isUp) ? $high[i] : $low[i];
        }
        if ((isUp && $low[i] < cursar) || (!isUp && cursar > $high[i])) {
            isUp = !isUp;
            factor = stepfactor;
            cursar = (isUp) ? Math.min(...$low.slice(i - 2, i + 1)) : Math.max(...$high.slice(i - 2, i + 1));
        }
        psar.push(cursar);
    }
    return psar;
}

/**
 * Calculates the Triple Exponential Moving Average (TEMA) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for the TEMA.
 * @returns {number[]} - The TEMA values.
 */
export function tema($close, window) {
  const ema1 = ema($close, window);
  const ema2 = ema(ema1, window);
  return pointwise((a, b, c) => 3 * a - 3 * b + c, ema1, ema2, ema(ema2, window));
}

/**
 * Calculates the Volume By Price (VBP) of a series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @param {number} zones - The number of zones in the VBP.
 * @param {number} left - The starting index for calculating the VBP.
 * @param {number} right - The ending index for calculating the VBP.
 * @returns {Object} - The VBP values.
 */
export function vbp($close, $volume, zones, left, right) {
  let total = 0;
  let bottom = Infinity;
  let top = -Infinity;
  const vbp = new Array(zones).fill(0);
  right = !isNaN(right) ? right : $close.length;
  for (let i = left; i < right; i++) {
    total += $volume[i];
    top = top < $close[i] ? $close[i] : top;
    bottom = bottom > $close[i] ? $close[i] : bottom;
  }
  for (let i = left; i < right; i++) {
    vbp[Math.floor(($close[i] - bottom) / (top - bottom) * (zones - 1))] += $volume[i];
  }
  return {
    bottom,
    top,
    volumes: vbp.map((x) => {
      return x / total;
    }),
  };
}

/**
 * Calculates the Volume Weighted Average Price (VWAP) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @returns {number[]} - The VWAP values.
 */
export function vwap($high, $low, $close, $volume) {
  const tp = typicalPrice($high, $low, $close);
  const cumulVTP = [$volume[0] * tp[0]];
  const cumulV = [$volume[0]];
  for (let i = 1, len = $close.length; i < len; i++) {
    cumulVTP[i] = cumulVTP[i - 1] + $volume[i] * tp[i];
    cumulV[i] = cumulV[i - 1] + $volume[i];
  }
  return pointwise((a, b) => a / b, cumulVTP, cumulV);
}

/**
 * Calculates the Zigzag indicator of a series.
 * @param {number[]} $time - The time values of the series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number} percent - The percentage threshold for the Zigzag indicator.
 * @returns {Object} - The Zigzag indicator values.
 */
export function zigzag($time, $high, $low, percent) {
  let lowest = $low[0];
  let thattime = $time[0];
  let isUp = false;
  let highest = $high[0];
  const time = [];
  const zigzag = [];
  for (let i = 1, len = $time.length; i < len; i++) {
    if (isUp) {
      if ($high[i] > highest) {
        thattime = $time[i];
        highest = $high[i];
      } else if ($low[i] < lowest + (highest - lowest) * (100 - percent) / 100) {
        isUp = false;
        time.push(thattime);
        zigzag.push(highest);
        lowest = $low[i];
      }
    } else {
      if ($low[i] < lowest) {
        thattime = $time[i];
        lowest = $low[i];
      } else if ($high[i] > lowest + (highest - lowest) * percent / 100) {
        isUp = true;
        time.push(thattime);
        zigzag.push(lowest);
        highest = $high[i];
      }
    }
  }
  return { time, price: zigzag };
}

/**
 * Calculates the Accumulation/Distribution Line (ADL) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number[]} $volume - The volume values of the series.
 * @returns {number[]} - The ADL values.
 */
export function adl($high, $low, $close, $volume) {
  const adl = [$volume[0] * (2 * $close[0] - $low[0] - $high[0]) / ($high[0] - $low[0])];
  for (let i = 1, len = $high.length; i < len; i++) {
    adl[i] = adl[i - 1] + $volume[i] * (2 * $close[i] - $low[i] - $high[i]) / ($high[i] - $low[i]);
  }
  return adl;
}

/**
 * Calculates the Average Directional Index (ADX) of a series.
 * @param {number[]} $high - The high values of the series.
 * @param {number[]} $low - The low values of the series.
 * @param {number[]} $close - The close values of the series.
 * @param {number} window - The window size for smoothing.
 * @returns {Object} - The ADX, DIP, and DIM values.
 */
export function adx($high, $low, $close, window) {
  let dmp = [0];
  let dmm = [0];
  for (let i = 1, len = $low.length; i < len; i++) {
    let hd = $high[i] - $high[i - 1];
    let ld = $low[i - 1] - $low[i];
    dmp.push(hd > ld ? Math.max(hd, 0) : 0);
    dmm.push(ld > hd ? Math.max(ld, 0) : 0);
  }
  let str = wilderSmooth(trueRange($high, $low, $close), window);
  dmp = wilderSmooth(dmp, window);
  dmm = wilderSmooth(dmm, window);
  let dip = pointwise((a, b) => (100 * a) / b, dmp, str);
  let dim = pointwise((a, b) => (100 * a) / b, dmm, str);
  let dx = pointwise(
    (a, b) => (100 * Math.abs(a - b)) / (a + b),
    dip,
    dim
  );
  return {
    dip,
    dim,
    adx: new Array(14).fill(NaN).concat(ema(dx.slice(14), 2 * window - 1)),
  };
}
