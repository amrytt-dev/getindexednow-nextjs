
// URL validation and correction utilities
export const isValidUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        // Ensure it has a valid protocol (http or https)
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

export const isUrlLike = (text: string): boolean => {
    // Check if the text looks like it might be a URL (starts with http/https)
    return /^https?:\/\//i.test(text.trim());
};

export const splitConcatenatedUrls = (text: string): string[] => {
    const urls: string[] = [];
    let currentIndex = 0;

    while (currentIndex < text.length) {
        // Find the next URL starting position
        const urlStart = text.indexOf('http', currentIndex);
        if (urlStart === -1) break;

        // Find where this URL ends (either at the start of the next URL or end of string)
        const nextUrlStart = text.indexOf('http', urlStart + 4);
        const urlEnd = nextUrlStart !== -1 ? nextUrlStart : text.length;

        // Extract the potential URL
        const potentialUrl = text.substring(urlStart, urlEnd);

        // Validate the URL
        if (isValidUrl(potentialUrl)) {
            urls.push(potentialUrl);
        }

        currentIndex = urlEnd;
    }

    return urls;
};

export const extractValidUrls = (input: string): {
    urls: string[],
    correctedInput: string,
    hasErrors: boolean,
    invalidLines: string[]
} => {
    const lines = input.split('\n');
    const validUrls: string[] = [];
    const correctedLines: string[] = [];
    const invalidLines: string[] = [];
    let hasErrors = false;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            correctedLines.push('');
            continue;
        }

        // Check for invalid strings after spaces (doesn't start with http/https)
        const parts = trimmedLine.split(' ');
        let hasInvalidAfterSpace = false;

        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            if (part && !part.startsWith('http://') && !part.startsWith('https://')) {
                hasInvalidAfterSpace = true;
                break;
            }
        }

        if (hasInvalidAfterSpace) {
            // Found invalid string after space - mark as invalid
            hasErrors = true;
            invalidLines.push(trimmedLine);
            correctedLines.push(trimmedLine);
            continue;
        }

        // Check for URLs without protocol (like "www.example.com" or "example.com")
        const hasUrlWithoutProtocol = /\s+(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}/.test(trimmedLine);

        if (hasUrlWithoutProtocol) {
            // Found a domain without protocol - mark as invalid
            hasErrors = true;
            invalidLines.push(trimmedLine);
            correctedLines.push(trimmedLine);
            continue;
        }

        // Check if the line contains multiple URLs concatenated together
        const concatenatedUrls = splitConcatenatedUrls(trimmedLine);

        if (concatenatedUrls.length > 1) {
            // Multiple URLs found in one line - split them
            hasErrors = true;
            validUrls.push(...concatenatedUrls);
            correctedLines.push(concatenatedUrls.join('\n'));
        } else if (concatenatedUrls.length === 1) {
            // Single URL found
            validUrls.push(concatenatedUrls[0]);
            correctedLines.push(concatenatedUrls[0]);
        } else {
            // No URLs found - check if it's a valid URL anyway
            if (isValidUrl(trimmedLine)) {
                validUrls.push(trimmedLine);
                correctedLines.push(trimmedLine);
            } else {
                // Invalid URL or plain string
                hasErrors = true;
                invalidLines.push(trimmedLine);
                correctedLines.push(trimmedLine);
            }
        }
    }

    return {
        urls: validUrls,
        correctedInput: correctedLines.join('\n'),
        hasErrors,
        invalidLines
    };
};

export const cleanInvalidStringsAfterSpaces = (text: string): string => {
    const lines = text.split('\n');
    const cleanedLines: string[] = [];

    for (const line of lines) {
        if (!line.trim()) {
            cleanedLines.push(line);
            continue;
        }

        // Split by spaces and filter out invalid parts
        const parts = line.split(' ');
        const validParts: string[] = [];

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            // If this part starts with http/https, keep it
            if (part.startsWith('http://') || part.startsWith('https://')) {
                validParts.push(part);
            } else if (i === 0) {
                // First part without http/https - check if it's a valid URL
                if (isValidUrl(part)) {
                    validParts.push(part);
                }
                // If not valid, skip it
            } else {
                // Part after space that doesn't start with http/https - skip it
                // This removes the invalid string until next space
            }
        }

        cleanedLines.push(validParts.join(' '));
    }

    return cleanedLines.join('\n');
};