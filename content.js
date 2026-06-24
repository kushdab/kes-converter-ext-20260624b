/**
 * kes-converter-ext-20260624b - content.js
 * Automatically detects international currency patterns and appends KES equivalent.
 */

(function() {
    const EXCHANGE_RATES = {
        'USD': 129.50,
        '$': 129.50,
        'EUR': 140.25,
        '€': 140.25,
        'GBP': 165.80,
        '£': 165.80,
        'KES': 1.0
    };

    const KES_FORMATTER = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    });

    const CURRENCY_REGEX = /([$€£]|USD|EUR|GBP)\s?(\d{1,3}(?:[\s,.]\d{3})*(?:[.,]\d{2})?)/gi;
    const SEEN_NODES = new WeakSet();

    /**
     * Parses a string value into a float, handling various separators.
     */
    function parseCurrencyValue(valueStr) {
        // Remove spaces and commas used as thousand separators
        let cleaned = valueStr.replace(/[\s,]/g, '');
        // If there's a dot and it looks like a decimal, keep it. 
        // Simple implementation for common e-commerce formats.
        return parseFloat(cleaned);
    }

    /**
     * Processes a single text node to find and convert prices.
     */
    function processTextNode(node) {
        if (!node.nodeValue || SEEN_NODES.has(node)) return;
        
        const originalText = node.nodeValue;
        let hasMatch = false;

        const replacedText = originalText.replace(CURRENCY_REGEX, (match, symbol, value) => {
            const numericValue = parseCurrencyValue(value);
            if (isNaN(numericValue)) return match;

            const upperSymbol = symbol.toUpperCase();
            const rate = EXCHANGE_RATES[upperSymbol] || EXCHANGE_RATES[symbol];

            if (rate && rate !== 1.0) {
                hasMatch = true;
                const kesAmount = numericValue * rate;
                return `${match} [~ ${KES_FORMATTER.format(kesAmount)}]`;
            }
            return match;
        });

        if (hasMatch) {
            node.nodeValue = replacedText;
            SEEN_NODES.add(node);
        }
    }

    /**
     * Recursively walks the DOM tree.
     */
    function walk(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.tagName.toUpperCase();
                    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(tag)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            processTextNode(node);
        }
    }

    // Run on initial load
    walk(document.body);

    // Observe dynamic changes (AJAX/Infinite Scroll)
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    walk(addedNode);
                } else if (addedNode.nodeType === Node.TEXT_NODE) {
                    processTextNode(addedNode);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('KES Converter Ext Active: Rates updated 2026-06-24');
})();