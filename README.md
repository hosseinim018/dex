# My Project

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/hosseinim018/view-technical)
[![Build Status](https://img.shields.io/travis/yourusername/yourproject/master.svg)](https://travis-ci.org/yourusername/yourproject)
[![Test Coverage](https://img.shields.io/codecov/c/github/yourusername/yourproject.svg)](https://codecov.io/gh/yourusername/yourproject)

## view-technical

this module prepare some oprating of technical analysis.

## Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
- [License](#License)
- [Contributing](#Contributing)
- [Versioning](#Versioning)
- [Build_and_Test](#Build_and_Test)
- [Support](#Support)


## Installation

Provide instructions on how to install and use your project.

## Usage

Explain how to use your project and include code examples if necessary.
importing:
```javascript
import * as vt from "./view-technical";
```

## summary of each function:

- [wma(series, window)](#wma): Calculates the Weighted Moving Average of a series using a specified window size.
- [mean(series)](#mean): Calculates the mean (average) of a series.
- [sd(series)](#sd): Calculates the standard deviation of a series.
- [cov(f, g)](#cov): Calculates the covariance between two series, f and g.
- [cor(f, g)](#cor): Calculates the correlation coefficient between two series, f and g.
- [mad(array)](#mad): Calculates the Mean Absolute Deviation (MAD) of an array.
- [pointwise(operation, ...serieses)](#pointwise): Applies a specified operation element-wise to one or more series.
- [rolling(operation, series, window)](#rolling): Performs a rolling operation on a series with a specified window size.
- [mae(f, g)](#mae): Calculates the Mean Absolute Error (MAE) between two series, f and g.
- [sma(series, window)](#sma): Calculates the Simple Moving Average (SMA) of a series using a specified window size.
- [ema(series, window, start)](#ema): Calculates the Exponential Moving Average (EMA) of a series using a specified window size and optional start value.
- [stdev(series, window)](#stdev): Calculates the rolling standard deviation of a series using a specified window size.
- [madev(series, window)](#madev): Calculates the rolling Mean Absolute Deviation (MAD) of a series using a specified window size.
- [expdev(series, window)](#expdev): Calculates the Exponential Deviation of a series using a specified window size.
- [atr($high, $low, $close, window)](#atr): Calculates the Average True Range (ATR) of high, low, and close prices using a specified window size.
- [wilderSmooth(series, window)](#wilderSmooth)(series, window): Performs a Wilder smoothing on a series with a specified window size.
- [typicalPrice($high, $low, $close)](#typicalPrice): Calculates the typical price of high, low, and close prices.
- [trueRange($high, $low, $close)](#trueRange): Calculates the true range of high, low, and close prices.
- [bb($close, window, mult)](#bb): Calculates the Bollinger Bands (BB) of a series using a specified window size and multiplier.
- [dema($close, window)](#dema): Calculates the Double Exponential Moving Average (DEMA) of a series using a specified window size.
- [ebb($close, window, mult)](#ebb): Calculates the Exponential Bollinger Bands (EBB) of a series using a specified window size and multiplier.
- [keltner($high, $low, $close, window, mult)](#keltner): Calculates the Keltner Channels of high, low, and close prices using a specified window size and multiplier.
- [psar($high, $low, stepfactor, maxfactor)](#psar): Calculates the Parabolic Stop and Reverse (PSAR) values based on high and low prices, step factor, and maximum factor.
- [tema($close, window)](#tema): Calculates the Triple Exponential Moving Average (TEMA) of a series.
- [vbp($close, $volume, zones, left, right)](#vbp): Calculates the Volume By Price (VBP) of a series.
- [vwap($high, $low, $close, $volume)](#vwap): Calculates the Volume Weighted Average Price (VWAP) of a series.
- [zigzag($time, $high, $low, percent)](#zigzag): Calculates the Zigzag indicator of a series.
- [adl($high, $low, $close, $volume)](#adl): Calculates the Accumulation/Distribution Line (ADL) of a series.
- [adx($high, $low, $close, window)](#adx): Calculates the Average Directional Index (ADX) of a series.
- [bbp($close, window, mult)](#bbp): Calculates the Bollinger Bands Percentage (BBP) of a series.
- [cci($high, $low, $close, window, mult)](#cci): Calculates the Commodity Channel Index (CCI) of a series.
- [cho($high, $low, $close, $volume, winshort, winlong)](#cho): Calculates the Chande's Oscillator (CHO) of a series.
- [fi($close, $volume, window)](#fi): Calculates the Force Index (FI) of a series.
- [kst($close, w1, w2, w3, w4, s1, s2, s3, s4, sig)](#kst): Calculates the Know Sure Thing (KST) of a series.
- [macd($close, winshort, winlong, winsig)](#macd): Calculates the Moving Average Convergence Divergence (MACD) of a series.
- [mfi($high, $low, $close, $volume, window)](#mfi): Calculates the Money Flow Index (MFI) of a series.
- [obv($close, $volume, signal)](#obv): Calculates the On-Balance Volume (OBV) of a series.
- [roc($close, window)](#roc): Calculates the Rate of Change (ROC) of a series.
- [rsi($close, window)](#rsi): Calculates the Relative Strength Index (RSI) of a series.
- [stoch($high, $low, $close, window, signal, smooth)](#stoch): Calculates the Stochastic Oscillator of a series.
- [stochRsi($close, window, signal, smooth)](#stochRsi): Calculates the Stochastic RSI (StochRSI) of a series.
- [vi($high, $low, $close, window)](#vi): Calculates the Vertical Horizontal Filter (VI) of a series.
- [williams($high, $low, $close, window)](#williams): Calculates the Williams %R indicator of a series.
- [FibonacciRetracement(pivot1, pivot2)](#FibonacciRetracement): Calculates the Fibonacci Retracement levels based on two pivot points.
- [regression(x, point1, point2)](#regression): Calculates the regression line value for a given x-coordinate using two points.

## apis

### wma

Calculates the Weighted Moving Average (WMA) of a series.

```javaScript
wma(series, window)
```
   - Parameters:
      - series (array): The input series.
      - window (number): The window size for the WMA.

   - Returns:
        (array): The WMA values.

### mean

Calculates the mean (average) of a series.

```javascript
mean(series)
```
   - Parameters:
      - series (array): The input series.

   - Returns:
        (number): The mean of the series.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contributing

If you would like to contribute to this project, please follow the [Contributing Guidelines](CONTRIBUTING.md).

## Versioning

We use [Semantic Versioning](https://semver.org/) for versioning.

## Build and Test

Provide instructions on how to build and test your project.

## Support

If you have any questions or need assistance, please reach out to us at [support@example.com](mailto:support@example.com).
