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

export function mean(series) {
    let sum = 0;
    for (let i = 0; i < series.length; i++) {
        sum += series[i];
    }
    return sum / series.length;
}

export function sd(series) {
    let E = mean(series);
    let E2 = mean(pointwise((x) => x * x, series));
    return Math.sqrt(E2 - E * E);
}

export function cov(f, g) {
    let Ef = mean(f), Eg = mean(g);
    let Efg = mean(pointwise((a, b) => a * b, f, g));
    return Efg - Ef * Eg;
}

export function cor(f, g) {
    let Ef = mean(f), Eg = mean(g);
    let Ef2 = mean(pointwise((a) => a * a, f));
    let Eg2 = mean(pointwise((a) => a * a, g));
    let Efg = mean(pointwise((a, b) => a * b, f, g));
    return (Efg - Ef * Eg) / Math.sqrt((Ef2 - Ef * Ef) * (Eg2 - Eg * Eg));
}

export function mad(array) {
    return mae(array, new Array(array.length).fill(mean(array)));
}

export function pointwise(operation, ...serieses) {
    let result = [];
    for (let i = 0, len = serieses[0].length; i < len; i++) {
        let iseries = (i) => serieses.map(x => x[i]);
        result[i] = operation(...iseries(i));
    }
    return result;
}

export function rolling(operation, series, window) {
    let result = [];
    for (let i = 0, len = series.length; i < len; i++) {
        let j = i + 1 - window;
        result.push(operation(series.slice((j > 0) ? j : 0, i + 1)));
    }
    return result;
}

export function mae(f, g) {
    const absDiff = pointwise((a, b) => Math.abs(a - b), f, g);
    return (f.length != g.length) ? Infinity : mean(absDiff);
}

export function sma(series, window) {
    return rolling((s) => mean(s), series, window);
}

export function ema(series, window, start) {
    let weight = 2 / (window + 1);
    let ema = [start ? start : mean(series.slice(0, window))];
    for (let i = 1, len = series.length; i < len; i++) {
        ema.push(series[i] * weight + (1 - weight) * ema[i - 1]);
    }
    return ema;
}

export function stdev(series, window) {
    return rolling((s) => sd(s), series, window);
}

export function madev(series, window) {
    return rolling((s) => mad(s), series, window);
}

export function expdev(series, window) {
    let sqrDiff = pointwise((a, b) => (a - b) * (a - b), series, ema(series, window));
    return pointwise((x) => Math.sqrt(x), ema(sqrDiff, window));
}

export function atr($high, $low, $close, window) {
    let tr = trueRange($high, $low, $close);
    return ema(tr, 2 * window - 1);
}

export function wilderSmooth(series, window) {
    let result = new Array(window).fill(NaN);
    result.push(series.slice(1, window + 1).reduce((sum, item) => {
        return sum += item;
    }, 0));
    for (let i = window + 1; i < series.length; i++) {
        result.push((1 - 1 / window) * result[i - 1] + series[i]);
    }
    return result;
}

export function typicalPrice($high, $low, $close) {
    return pointwise((a, b, c) => (a + b + c) / 3, $high, $low, $close);
}

export function trueRange($high, $low, $close) {
    let tr = [$high[0] - $low[0]];
    for (let i = 1, len = $low.length; i < len; i++) {
        tr.push(Math.max($high[i] - $low[i], Math.abs($high[i] - $close[i - 1]), Math.abs($low[i] - $close[i - 1])));
    }
    return tr;
}

export function bb($close, window, mult) {
    let ma = sma($close, window);
    let dev = stdev($close, window);
    let upper = pointwise((a, b) => a + b * mult, ma, dev);
    let lower = pointwise((a, b) => a - b * mult, ma, dev);
    return {lower: lower, middle: ma, upper: upper};
}

export function dema($close, window) {
    let ema1 = ema($close, window);
    return pointwise((a, b) => 2 * a - b, ema1, ema(ema1, window));
}

export function ebb($close, window, mult) {
    let ma = ema($close, window);
    let dev = expdev($close, window);
    let upper = pointwise((a, b) => a + b * mult, ma, dev);
    let lower = pointwise((a, b) => a - b * mult, ma, dev);
    return {lower: lower, middle: ma, upper: upper};
}

export function keltner($high, $low, $close, window, mult) {
    let middle = ema($close, window);
    let upper = pointwise((a, b) => a + mult * b, middle, atr($high, $low, $close, window));
    let lower = pointwise((a, b) => a - mult * b, middle, atr($high, $low, $close, window));
    return {lower: lower, middle: middle, upper: upper};
}

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

export function tema($close, window) {
    let ema1 = ema($close, window);
    let ema2 = ema(ema1, window);
    return pointwise((a, b, c) => 3 * a - 3 * b + c, ema1, ema2, ema(ema2, window));
}

export function vbp($close, $volume, zones, left, right) {
    let total = 0;
    let bottom = Infinity;
    let top = -Infinity;
    let vbp = new Array(zones).fill(0);
    right = !isNaN(right) ? right : $close.length;
    for (let i = left; i < right; i++) {
        total += $volume[i];
        top = (top < $close[i]) ? $close[i] : top;
        bottom = (bottom > $close[i]) ? $close[i] : bottom;
    }
    for (let i = left; i < right; i++) {
        vbp[Math.floor(($close[i] - bottom) / (top - bottom) * (zones - 1))] += $volume[i];
    }
    return {
        bottom: bottom, top: top, volumes: vbp.map((x) => {
            return x / total;
        })
    };
}

export function vwap($high, $low, $close, $volume) {
    let tp = typicalPrice($high, $low, $close), cumulVTP = [$volume[0] * tp[0]], cumulV = [$volume[0]];
    for (let i = 1, len = $close.length; i < len; i++) {
        cumulVTP[i] = cumulVTP[i - 1] + $volume[i] * tp[i];
        cumulV[i] = cumulV[i - 1] + $volume[i];
    }
    return pointwise((a, b) => a / b, cumulVTP, cumulV);
}

export function zigzag($time, $high, $low, percent) {
    let lowest = $low[0], thattime = $time[0], isUp = false;
    let highest = $high[0], time = [], zigzag = [];
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
    return {time: time, price: zigzag};
}

export function adl($high, $low, $close, $volume) {
    let adl = [$volume[0] * (2 * $close[0] - $low[0] - $high[0]) / ($high[0] - $low[0])];
    for (let i = 1, len = $high.length; i < len; i++) {
        adl[i] = adl[i - 1] + $volume[i] * (2 * $close[i] - $low[i] - $high[i]) / ($high[i] - $low[i]);
    }
    return adl;
}

export function adx($high, $low, $close, window) {
    let dmp = [0], dmm = [0];
    for (let i = 1, len = $low.length; i < len; i++) {
        let hd = $high[i] - $high[i - 1];
        let ld = $low[i - 1] - $low[i];
        dmp.push((hd > ld) ? Math.max(hd, 0) : 0);
        dmm.push((ld > hd) ? Math.max(ld, 0) : 0);
    }
    let str = wilderSmooth(trueRange($high, $low, $close), window);
    dmp = wilderSmooth(dmp, window);
    dmm = wilderSmooth(dmm, window);
    let dip = pointwise((a, b) => 100 * a / b, dmp, str);
    let dim = pointwise((a, b) => 100 * a / b, dmm, str);
    let dx = pointwise((a, b) => 100 * Math.abs(a - b) / (a + b), dip, dim);
    return {dip: dip, dim: dim, adx: new Array(14).fill(NaN).concat(ema(dx.slice(14), 2 * window - 1))};
}

export function bbp($close, window, mult) {
    let band = bb($close, window, mult);
    return pointwise((p, u, l) => (p - l) / (u - l), $close, band.upper, band.lower);
}

export function cci($high, $low, $close, window, mult) {
    let tp = typicalPrice($high, $low, $close);
    let tpsma = sma(tp, window);
    let tpmad = madev(tp, window);
    tpmad[0] = Infinity;
    return pointwise((a, b, c) => (a - b) / (c * mult), tp, tpsma, tpmad);
}

export function cho($high, $low, $close, $volume, winshort, winlong) {
    let adli = adl($high, $low, $close, $volume);
    return pointwise((s, l) => s - l, ema(adli, winshort), ema(adli, winlong));
}

export function fi($close, $volume, window) {
    let delta = rolling((s) => s[s.length - 1] - s[0], $close, 2);
    return ema(pointwise((a, b) => a * b, delta, $volume), window);
}

export function kst($close, w1, w2, w3, w4, s1, s2, s3, s4, sig) {
    let rcma1 = sma(roc($close, w1), s1);
    let rcma2 = sma(roc($close, w2), s2);
    let rcma3 = sma(roc($close, w3), s3);
    let rcma4 = sma(roc($close, w4), s4);
    let line = pointwise((a, b, c, d) => a + b * 2 + c * 3 + d * 4, rcma1, rcma2, rcma3, rcma4);
    return {line: line, signal: sma(line, sig)};
}

export function macd($close, winshort, winlong, winsig) {
    const line = pointwise((a, b) => a - b, ema($close, winshort), ema($close, winlong));
    const signal = ema(line, winsig);
    const hist = pointwise((a, b) => a - b, line, signal);
    return {line: line, signal: signal, hist: hist};
}

export function mfi($high, $low, $close, $volume, window) {
    let pmf = [0], nmf = [0];
    let tp = typicalPrice($high, $low, $close);
    for (let i = 1, len = $close.length; i < len; i++) {
        let diff = tp[i] - tp[i - 1];
        pmf.push(diff >= 0 ? tp[i] * $volume[i] : 0);
        nmf.push(diff < 0 ? tp[i] * $volume[i] : 0);
    }
    pmf = rolling((s) => s.reduce((sum, x) => {
        return sum + x;
    }, 0), pmf, window);
    nmf = rolling((s) => s.reduce((sum, x) => {
        return sum + x;
    }, 0), nmf, window);
    return pointwise((a, b) => 100 - 100 / (1 + a / b), pmf, nmf);
}

export function obv($close, $volume, signal) {
    let obv = [0];
    for (let i = 1, len = $close.length; i < len; i++) {
        obv.push(obv[i - 1] + Math.sign($close[i] - $close[i - 1]) * $volume[i]);
    }
    return {line: obv, signal: sma(obv, signal)};
}

export function roc($close, window) {
    let result = new Array(window).fill(NaN);
    for (let i = window, len = $close.length; i < len; i++) {
        result.push(100 * ($close[i] - $close[i - window]) / $close[i - window]);
    }
    return result;
}

export function rsi($close, window) {
    let gains = [0], loss = [1e-14];
    for (let i = 1, len = $close.length; i < len; i++) {
        let diff = $close[i] - $close[i - 1];
        gains.push(diff >= 0 ? diff : 0);
        loss.push(diff < 0 ? -diff : 0);
    }
    return pointwise((a, b) => 100 - 100 / (1 + a / b), ema(gains, 2 * window - 1), ema(loss, 2 * window - 1));
}

export function stoch($high, $low, $close, window, signal, smooth) {
    let lowest = rolling((s) => Math.min(...s), $low, window);
    let highest = rolling((s) => Math.max(...s), $high, window);
    let K = pointwise((h, l, c) => 100 * (c - l) / (h - l), highest, lowest, $close);
    if (smooth > 1) {
        K = sma(K, smooth);
    }
    return {line: K, signal: sma(K, signal)};
}

export function stochRsi($close, window, signal, smooth) {
    let _rsi = rsi($close, window);
    let extreme = rolling((s) => {
        return {low: Math.min(...s), high: Math.max(...s)};
    }, _rsi, window);
    let K = pointwise((rsi, e) => (rsi - e.low) / (e.high - e.low), _rsi, extreme);
    K[0] = 0;
    if (smooth > 1) {
        K = sma(K, smooth);
    }
    return {line: K, signal: sma(K, signal)};
}

export function vi($high, $low, $close, window) {
    let pv = [($high[0] - $low[0]) / 2], nv = [pv[0]];
    for (let i = 1, len = $high.length; i < len; i++) {
        pv.push(Math.abs($high[i] - $low[i - 1]));
        nv.push(Math.abs($high[i - 1] - $low[i]));
    }
    let apv = rolling((s) => s.reduce((sum, x) => {
        return sum + x;
    }, 0), pv, window);
    let anv = rolling((s) => s.reduce((sum, x) => {
        return sum + x;
    }, 0), nv, window);
    let atr = rolling((s) => s.reduce((sum, x) => {
        return sum + x;
    }, 0), trueRange($high, $low, $close), window);
    return {plus: pointwise((a, b) => a / b, apv, atr), minus: pointwise((a, b) => a / b, anv, atr)};
}

export function williams($high, $low, $close, window) {
    return pointwise((x) => x - 100, stoch($high, $low, $close, window, 1, 1).line);
}

export function FibonacciRetracement(pivot1, pivot2) {
    /**
     * start and end pivot is 0, 10
     * result : {
     *   1: 0
     *   0.786: 2.1399999999999997,
     *   0.618: 3.8200000000000003,
     *   0.5: 5,
     *   0.382: 6.18,
     *   0.236: 7.640000000000001,
     *   0: 10,
     * }
     */
    const retracements = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
    const high = Math.max(pivot1, pivot2)
    const low = Math.min(pivot1, pivot2)
    const range = high - low
    const levels = retracements.map(level => high - range * level)
    const obj = {}
    retracements.forEach((el, index) => {
        obj[el] = levels[index]
    })
    return obj
}
export function regression(x, point1, point2){
    // find slope and y-intercept
    const slope = (point2[1]-point1[1])/(point2[0]-point1[0])
    const yIntercept = point1[1] - slope * point1[0]
    // the final equation will be : y = slope*x + yIntercept
    return slope*x +yIntercept
}