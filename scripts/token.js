let tokenCache = null;

/**
 * CORS proxy base URL. External APIs (dishtv.in, d2h.com) may not allow browser origins;
 * routing through a proxy avoids CORS. Set to '' to call APIs directly (when they allow CORS).
 * Format: https://eds-cors-proxy.vercel.app/api/proxy?url=<target-url>
 */
const CORS_PROXY_BASE = 'https://eds-cors-proxy.vercel.app/api/proxy?url=';

export function proxyUrl(url) {
  if (!CORS_PROXY_BASE) return url;
  return `${CORS_PROXY_BASE}${encodeURIComponent(url)}`;
}

export async function getToken() {
  if (tokenCache) return tokenCache;

  // Check if cookie already exists
  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='));

  if (cookieToken) {
    tokenCache = cookieToken.split('=')[1];
    return tokenCache;
  }

  try {
    // API 1 -> Get IP (via proxy if needed to avoid CORS)
    const ipApiUrl = 'https://beta2-bizlogic-api.dishtv.in/API/test/service';
    const ipResponse = await fetch(proxyUrl(ipApiUrl));
    const ipDataText = await ipResponse.text();

    // Extract IP from raw text response. Looks like "Return ClientIP :103.68.20.246"
    const ipMatch = ipDataText.match(/Return ClientIP\s*:([0-9.]+)/);
    let ip = '';

    if (ipMatch && ipMatch[1]) {
      ip = ipMatch[1].trim();
    } else {
      throw new Error('Could not extract IP from service response');
    }

    // API 2 -> Get Token (via proxy if needed to avoid CORS)
    const tokenApiUrl = 'https://beta2-bizconnect-api.d2h.com/API/Auth/AnonymousToken';
    const tokenResponse = await fetch(proxyUrl(tokenApiUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: Browsers usually restrict setting Cookie headers in fetch requests directly,
        // but included as requested by the curl command.
        Cookie: 'ApplicationGatewayAffinity=0477efce08c05587747158c5002e8e5e; ApplicationGatewayAffinityCORS=0477efce08c05587747158c5002e8e5e',
      },
      body: JSON.stringify({ IP: ip }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.responseCode === 200 && tokenData.data && tokenData.data.token) {
      const token = tokenData.data.token;

      // Store in cookie
      document.cookie = `token=${token}; path=/; max-age=86400`;

      tokenCache = token;

      return token;
    } else {
      throw new Error('Failed to retrieve token from Auth API');
    }

  } catch (err) {
    console.error('Token fetch failed', err);
    return null;
  }
}

// Global utility for reading cookies (might be used by your other scripts like lead-form.js)
window.readCookie = function(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};