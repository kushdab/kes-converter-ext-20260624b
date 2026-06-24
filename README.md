# KES Converter Extension 20260624b

This browser extension automatically detects international currency formats (USD, EUR, GBP) on any website and appends the estimated Kenyan Shilling (KES) value right next to it.

## Features
- Real-time conversion using June 2026 projected rates.
- Supports symbols ($, €, £) and codes (USD, EUR, GBP).
- Uses `MutationObserver` to handle dynamically loaded content (e.g., Amazon, eBay, AliExpress).
- Lightweight with zero dependencies.

## Installation
1. Download or clone this repository.
2. Open your browser's extensions page (`chrome://extensions` for Chrome or `edge://extensions` for Edge).
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the folder containing these files.

## Usage
Once installed, navigate to any international e-commerce site. Prices like `$50.00` will automatically update to look like `$50.00 [~ KSh 6,475.00]`.

## Technical Details
- **Main Script**: `content.js` handles DOM traversal and regex matching.
- **Regex**: Optimized to find currency patterns without breaking layout.
- **Performance**: Uses `WeakSet` to track processed nodes and prevent redundant calculations.