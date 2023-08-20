# My Project

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/yourusername/yourproject)
[![Build Status](https://img.shields.io/travis/yourusername/yourproject/master.svg)](https://travis-ci.org/yourusername/yourproject)
[![Test Coverage](https://img.shields.io/codecov/c/github/yourusername/yourproject.svg)](https://codecov.io/gh/yourusername/yourproject)

## view-technical

this module prepare some oprating of technical analysis.

## Table of Contents

- [Installation](##Installation)
- [Usage](##Usage)
- [License](##License)
- [Contributing](##Contributing)
- [Versioning](##Versioning)
- [Build and Test](##Build and Test)
- [Support](##Support)


## Installation

Provide instructions on how to install and use your project.

## Usage

Explain how to use your project and include code examples if necessary.

## summary of each function:

    wma(series, window): Calculates the Weighted Moving Average of a series using a specified window size.
    mean(series): Calculates the mean (average) of a series.
    sd(series): Calculates the standard deviation of a series.
    cov(f, g): Calculates the covariance between two series, f and g.
    cor(f, g): Calculates the correlation coefficient between two series, f and g.
    mad(array): Calculates the Mean Absolute Deviation (MAD) of an array.
    pointwise(operation, ...serieses): Applies a specified operation element-wise to one or more series.
    rolling(operation, series, window): Performs a rolling operation on a series with a specified window size.
    mae(f, g): Calculates the Mean Absolute Error (MAE) between two series, f and g.
    sma(series, window): Calculates the Simple Moving Average (SMA) of a series using a specified window size.
    ema(series, window, start): Calculates the Exponential Moving Average (EMA) of a series using a specified window size and optional start value.
    stdev(series, window): Calculates the rolling standard deviation of a series using a specified window size.
    madev(series, window): Calculates the rolling Mean Absolute Deviation (MAD) of a series using a specified window size.
    expdev(series, window): Calculates the Exponential Deviation of a series using a specified window size.
    atr($high, $low, $close, window): Calculates the Average True Range (ATR) of high, low, and close prices using a specified window size.
    wilderSmooth(series, window): Performs a Wilder smoothing on a series with a specified window size.
    typicalPrice($high, $low, $close): Calculates the typical price of high, low, and close prices.
    trueRange($high, $low, $close): Calculates the true range of high, low, and close prices.
    bb($close, window, mult): Calculates the Bollinger Bands (BB) of a series using a specified window size and multiplier.
    dema($close, window): Calculates the Double Exponential Moving Average (DEMA) of a series using a specified window size.
    ebb($close, window, mult): Calculates the Exponential Bollinger Bands (EBB) of a series using a specified window size and multiplier.
    keltner($high, $low, $close, window, mult): Calculates the Keltner Channels of high, low, and close prices using a specified window size and multiplier.
    psar($high, $low, stepfactor, maxfactor): Calculates the Parabolic Stop and Reverse (PSAR) values based on high and low prices, step factor, and maximum factor.

## Table of Contents

- [vi](#vi)
- [williams](#williams)
- [FibonacciRetracement](#fibonacciretracement)
- [regression](#regression)

## vi

Calculates the Vertical Horizontal Filter (VI) of a series.

```javaScript
vi($high, $low, $close, window)
```
   - Parameters:
      -  $high (array): The high values of the series.
      -  $low (array): The low values of the series.
      - $close (array): The close values of the series.
      - window (number): The window size for calculating VI.

   - Returns:
        (object): An object containing the VI plus and minus values.

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