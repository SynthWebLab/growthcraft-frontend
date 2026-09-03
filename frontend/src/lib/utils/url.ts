/**
 * Validates a candidate URL and returns a safe internal URL for redirection.
 * Rejects external URLs, protocol-relative URLs, and javascript:/data: URLs.
 * 
 * @param candidateUrl The URL to validate (usually from a query parameter)
 * @param fallbackUrl The fallback URL if the candidate is invalid (default: '/')
 * @returns A safe internal URL
 */
export function getSafeCallbackUrl(candidateUrl: string | null | undefined, fallbackUrl: string = '/'): string {
  if (!candidateUrl || typeof candidateUrl !== 'string') {
    return fallbackUrl;
  }

  // Remove whitespace
  const trimmedUrl = candidateUrl.trim();

  // Basic validation for internal paths:
  // Must start with a single `/` and NOT `//`
  if (!trimmedUrl.startsWith('/') || trimmedUrl.startsWith('//')) {
    return fallbackUrl;
  }

  // Check for malicious schemes just in case
  const lowerUrl = trimmedUrl.toLowerCase();
  if (
    lowerUrl.includes('javascript:') ||
    lowerUrl.includes('data:') ||
    lowerUrl.includes('vbscript:') ||
    lowerUrl.includes('mailto:') ||
    lowerUrl.includes('file:')
  ) {
    return fallbackUrl;
  }

  // Attempt to parse as a full URL to check for unexpected hostnames
  try {
    // If it parses successfully with a dummy base, it's a valid relative URL
    const parsed = new URL(trimmedUrl, 'http://dummy.local');
    
    // Ensure the pathname still starts with / and didn't somehow parse out an external domain
    if (parsed.hostname !== 'dummy.local') {
      return fallbackUrl;
    }

    // Return the safe path + search + hash
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch (e) {
    // If URL parsing fails, it's malformed
    return fallbackUrl;
  }
}
