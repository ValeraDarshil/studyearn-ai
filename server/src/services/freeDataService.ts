// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Free Data Service
// ─────────────────────────────────────────────────────────────
// 100% FREE, NO API KEYS, UNLIMITED requests
// Handles: crypto prices, currency rates, gold/silver,
//          Wikipedia facts, time zones, country data, weather
// ─────────────────────────────────────────────────────────────

import { logger } from '../utils/logger.js';

const FETCH_TIMEOUT = 8_000; // 8 seconds

function timedFetch(url: string): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
}

// ─────────────────────────────────────────────────────────────
// QUERY CLASSIFIER
// ─────────────────────────────────────────────────────────────

export type FreeQueryType =
  | 'crypto_price'
  | 'gold_silver'
  | 'currency_rate'
  | 'wikipedia'
  | 'timezone'
  | 'country_info'
  | 'weather'
  | 'none';

interface ClassifiedQuery {
  type: FreeQueryType;
  params: Record<string, string>;
}

export function classifyFreeQuery(prompt: string): ClassifiedQuery {
  const p = prompt.trim().toLowerCase();

  // ── Crypto prices ──────────────────────────────────────
  const cryptoMap: Record<string, string> = {
    bitcoin: 'bitcoin', btc: 'bitcoin',
    ethereum: 'ethereum', eth: 'ethereum',
    solana: 'solana', sol: 'solana',
    dogecoin: 'dogecoin', doge: 'dogecoin',
    ripple: 'ripple', xrp: 'ripple',
    cardano: 'cardano', ada: 'cardano',
    binance: 'binancecoin', bnb: 'binancecoin',
    polygon: 'matic-network', matic: 'matic-network',
    litecoin: 'litecoin', ltc: 'litecoin',
    polkadot: 'polkadot', dot: 'polkadot',
    tether: 'tether', usdt: 'tether',
  };
  for (const [key, id] of Object.entries(cryptoMap)) {
    if (p.includes(key) && (p.includes('price') || p.includes('rate') || p.includes('worth') || p.includes('value') || p.includes('cost') || p.includes('how much'))) {
      return { type: 'crypto_price', params: { coinId: id, coinName: key } };
    }
  }

  // ── Gold / Silver ────────────────────────────────────
  if ((p.includes('gold') || p.includes('silver')) &&
      (p.includes('price') || p.includes('rate') || p.includes('today') || p.includes('cost') || p.includes('how much'))) {
    const metal = p.includes('silver') ? 'silver' : 'gold';
    return { type: 'gold_silver', params: { metal } };
  }

  // ── Currency / Forex ─────────────────────────────────
  const currencyPairs = [
    { keys: ['usd', 'dollar'], target: 'USD' },
    { keys: ['eur', 'euro'],   target: 'EUR' },
    { keys: ['gbp', 'pound'],  target: 'GBP' },
    { keys: ['jpy', 'yen'],    target: 'JPY' },
    { keys: ['inr', 'rupee'],  target: 'INR' },
    { keys: ['aed', 'dirham'], target: 'AED' },
    { keys: ['sgd'],           target: 'SGD' },
    { keys: ['aud'],           target: 'AUD' },
    { keys: ['cad'],           target: 'CAD' },
  ];
  if (p.includes('exchange rate') || p.includes('conversion') ||
      (p.includes('rate') && currencyPairs.some(c => c.keys.some(k => p.includes(k)))) ||
      (p.includes('to inr') || p.includes('to usd') || p.includes('to eur'))) {
    // detect base and target
    let from = 'USD', to = 'INR';
    for (const pair of currencyPairs) {
      if (pair.keys.some(k => p.includes(k))) {
        if (p.includes('to inr') || p.includes('in inr')) { from = pair.target; to = 'INR'; }
        else if (p.includes('to usd') || p.includes('in usd')) { from = pair.target; to = 'USD'; }
        else { from = pair.target; }
      }
    }
    return { type: 'currency_rate', params: { from, to } };
  }

  // ── Time zones ────────────────────────────────────────
  const tzMap: Record<string, string> = {
    'us':            'America/New_York',
    'usa':           'America/New_York',
    'new york':      'America/New_York',
    'los angeles':   'America/Los_Angeles',
    'chicago':       'America/Chicago',
    'london':        'Europe/London',
    'uk':            'Europe/London',
    'paris':         'Europe/Paris',
    'dubai':         'Asia/Dubai',
    'uae':           'Asia/Dubai',
    'singapore':     'Asia/Singapore',
    'tokyo':         'Asia/Tokyo',
    'japan':         'Asia/Tokyo',
    'sydney':        'Australia/Sydney',
    'australia':     'Australia/Sydney',
    'berlin':        'Europe/Berlin',
    'germany':       'Europe/Berlin',
    'toronto':       'America/Toronto',
    'canada':        'America/Toronto',
    'moscow':        'Europe/Moscow',
    'russia':        'Europe/Moscow',
    'beijing':       'Asia/Shanghai',
    'china':         'Asia/Shanghai',
    'india':         'Asia/Kolkata',
    'mumbai':        'Asia/Kolkata',
    'delhi':         'Asia/Kolkata',
    'pakistan':      'Asia/Karachi',
    'karachi':       'Asia/Karachi',
    'bangladesh':    'Asia/Dhaka',
    'dhaka':         'Asia/Dhaka',
  };
  if (p.includes('time') || p.includes('timing') || p.includes('what time')) {
    for (const [loc, tz] of Object.entries(tzMap)) {
      if (p.includes(loc)) {
        return { type: 'timezone', params: { location: loc, timezone: tz } };
      }
    }
  }

  // ── Country info ──────────────────────────────────────
  if (p.includes('capital of') || p.includes('currency of') ||
      p.includes('population of') || p.includes('language of') ||
      (p.includes('president') && !p.includes('who is')) ||
      (p.includes('prime minister') && !p.includes('who is'))) {
    const match = p.match(/(?:capital|currency|population|language|president|prime minister)\s+of\s+([a-z\s]+)/);
    if (match) return { type: 'country_info', params: { country: match[1].trim() } };
  }

  // ── Wikipedia / General Knowledge ────────────────────
  const wikiTriggers = [
    /^who (?:is|was|are|were)\s+(.+)/,
    /^what is\s+(.+)/,
    /^tell me about\s+(.+)/,
    /^(?:explain|describe)\s+(.+)/,
    /^(?:founder|ceo|inventor|creator) of\s+(.+)/,
    /^history of\s+(.+)/,
    /^(?:diameter|radius|mass|distance|size|weight|height) of\s+(.+)/,
    /^(?:population) of\s+(.+)/,
    /^(?:capital|currency) of\s+(.+)/,
  ];
  for (const pattern of wikiTriggers) {
    const match = p.match(pattern);
    if (match) {
      return { type: 'wikipedia', params: { query: match[1].trim() } };
    }
  }

  return { type: 'none', params: {} };
}

// ─────────────────────────────────────────────────────────────
// DATA FETCHERS — All 100% free, no API keys
// ─────────────────────────────────────────────────────────────

// 1. CRYPTO — CoinGecko (free, no key, generous limits)
async function fetchCryptoPrice(coinId: string, coinName: string): Promise<string> {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd,inr&include_24hr_change=true&include_market_cap=true`;
  const res  = await timedFetch(url);
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const data = await res.json();
  const coin = data[coinId];
  if (!coin) throw new Error('Coin not found');

  const usd    = coin.usd?.toLocaleString('en-US') || 'N/A';
  const inr    = coin.inr?.toLocaleString('en-IN') || 'N/A';
  const change = coin.usd_24h_change?.toFixed(2) || '0';
  const mcap   = coin.usd_market_cap ? `$${(coin.usd_market_cap / 1e9).toFixed(2)}B` : 'N/A';
  const arrow  = parseFloat(change) >= 0 ? '📈' : '📉';
  const name   = coinName.charAt(0).toUpperCase() + coinName.slice(1);

  return `## ${name} Price 💰

| | Price |
|--|--|
| 🇺🇸 USD | **$${usd}** |
| 🇮🇳 INR | **₹${inr}** |

${arrow} **24h Change:** ${change}%
📊 **Market Cap:** ${mcap}

*Live data via CoinGecko*`;
}

// 2. GOLD / SILVER — metals.live (free, no key)
async function fetchMetalPrice(metal: string): Promise<string> {
  // metals.live returns prices in USD per troy ounce
  const url = 'https://metals.live/api/spot';
  const res  = await timedFetch(url);
  if (!res.ok) throw new Error(`metals.live HTTP ${res.status}`);
  const data = await res.json();

  // data is array of {gold: number, silver: number, ...}
  const latest = Array.isArray(data) ? data[data.length - 1] : data;
  const priceUSD = latest[metal];
  if (!priceUSD) throw new Error('Metal price not found');

  // Convert USD to INR (approximate using frankfurter)
  let inrRate = 84; // fallback rate
  try {
    const fxRes = await timedFetch('https://api.frankfurter.app/latest?from=USD&to=INR');
    if (fxRes.ok) {
      const fxData = await fxRes.json();
      inrRate = fxData.rates?.INR || 84;
    }
  } catch { /* use fallback */ }

  const priceINR     = (priceUSD * inrRate).toFixed(0);
  const priceINR10g  = ((priceUSD * inrRate) / 31.1035 * 10).toFixed(0); // per 10g
  const metalName    = metal.charAt(0).toUpperCase() + metal.slice(1);
  const emoji        = metal === 'gold' ? '🥇' : '🥈';

  return `## ${emoji} ${metalName} Price Today

| Unit | USD | INR |
|------|-----|-----|
| Per Troy Ounce (31.1g) | **$${Number(priceUSD).toFixed(2)}** | **₹${Number(priceINR).toLocaleString('en-IN')}** |
| Per 10 Gram | **$${(priceUSD/31.1035*10).toFixed(2)}** | **₹${Number(priceINR10g).toLocaleString('en-IN')}** |

📌 *Spot price. Actual jewellery price includes making charges + GST*
*Live data via metals.live*`;
}

// 3. CURRENCY — Frankfurter (free, ECB data, no key, unlimited)
async function fetchCurrencyRate(from: string, to: string): Promise<string> {
  const url = `https://api.frankfurter.app/latest?from=${from}&to=${to}`;
  const res  = await timedFetch(url);
  if (!res.ok) throw new Error(`Frankfurter HTTP ${res.status}`);
  const data = await res.json();
  const rate = data.rates?.[to];
  if (!rate) throw new Error('Rate not found');

  const flagMap: Record<string, string> = {
    USD: '🇺🇸', INR: '🇮🇳', EUR: '🇪🇺', GBP: '🇬🇧',
    JPY: '🇯🇵', AED: '🇦🇪', SGD: '🇸🇬', AUD: '🇦🇺',
    CAD: '🇨🇦', CHF: '🇨🇭', CNY: '🇨🇳',
  };
  const f1 = flagMap[from] || '💱';
  const f2 = flagMap[to]   || '💱';

  return `## ${f1} ${from} → ${f2} ${to} Exchange Rate

**1 ${from} = ${rate.toFixed(4)} ${to}**

| Amount | ${to} |
|--------|-------|
| 1 ${from} | ${rate.toFixed(4)} |
| 10 ${from} | ${(rate * 10).toFixed(2)} |
| 100 ${from} | ${(rate * 100).toFixed(2)} |
| 1000 ${from} | ${(rate * 1000).toFixed(2)} |

📅 *Rate from European Central Bank (ECB) via Frankfurter*`;
}

// 4. TIMEZONE — WorldTimeAPI (free, no key)
async function fetchTimezone(location: string, timezone: string): Promise<string> {
  const url = `https://worldtimeapi.org/api/timezone/${timezone}`;
  const res  = await timedFetch(url);
  if (!res.ok) throw new Error(`WorldTimeAPI HTTP ${res.status}`);
  const data = await res.json();

  const dt      = new Date(data.datetime);
  const timeStr = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const offset  = data.utc_offset || '+00:00';
  const abbrev  = data.abbreviation || timezone;

  const loc = location.charAt(0).toUpperCase() + location.slice(1);

  return `## 🕐 Current Time in ${loc}

**⏰ ${timeStr}**
📅 ${dateStr}

🌍 Timezone: **${timezone}** (${abbrev})
🔄 UTC Offset: **${offset}**

*Live data via WorldTimeAPI*`;
}

// 5. COUNTRY INFO — REST Countries (free, no key, unlimited)
async function fetchCountryInfo(country: string): Promise<string> {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fullText=false`;
  const res  = await timedFetch(url);
  if (!res.ok) throw new Error(`REST Countries HTTP ${res.status}`);
  const data = await res.json();
  const c    = data[0];
  if (!c) throw new Error('Country not found');

  const name       = c.name?.common || country;
  const capital    = c.capital?.[0] || 'N/A';
  const population = c.population ? c.population.toLocaleString('en-IN') : 'N/A';
  const region     = c.region || 'N/A';
  const currencies = c.currencies
    ? Object.values(c.currencies as any).map((v: any) => `${v.name} (${v.symbol || ''})`).join(', ')
    : 'N/A';
  const languages = c.languages
    ? Object.values(c.languages as any).join(', ')
    : 'N/A';
  const flag  = c.flag || '🏳';
  const area  = c.area ? `${c.area.toLocaleString()} km²` : 'N/A';

  return `## ${flag} ${name}

| Detail | Info |
|--------|------|
| 🏛️ Capital | **${capital}** |
| 👥 Population | **${population}** |
| 💰 Currency | **${currencies}** |
| 🗣️ Languages | **${languages}** |
| 🌍 Region | **${region}** |
| 📐 Area | **${area}** |

*Data via REST Countries API*`;
}

// 6. WIKIPEDIA — MediaWiki API (free, no key, unlimited)
async function fetchWikipedia(query: string): Promise<string> {
  // First search for the right article
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json&origin=*`;
  const searchRes = await timedFetch(searchUrl);
  if (!searchRes.ok) throw new Error(`Wikipedia search HTTP ${searchRes.status}`);
  const searchData = await searchRes.json();

  const title = searchData[1]?.[0];
  if (!title) throw new Error('No Wikipedia result found');

  // Fetch the summary
  const summaryUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&exintro=true&explaintext=true&exsectionformat=plain&format=json&origin=*`;
  const summaryRes = await timedFetch(summaryUrl);
  if (!summaryRes.ok) throw new Error(`Wikipedia summary HTTP ${summaryRes.status}`);
  const summaryData = await summaryRes.json();

  const pages  = summaryData.query?.pages || {};
  const pageId = Object.keys(pages)[0];
  if (pageId === '-1') throw new Error('Wikipedia page not found');

  const extract = pages[pageId]?.extract || '';
  // Take first 3 paragraphs max
  const paras = extract.split('\n').filter((l: string) => l.trim().length > 40).slice(0, 3);
  const summary = paras.join('\n\n');

  if (!summary) throw new Error('Empty Wikipedia extract');

  return `## 📖 ${title}

${summary}

*Source: Wikipedia*`;
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — Try free data, return null if not applicable
// ─────────────────────────────────────────────────────────────

export async function tryFreeDataAnswer(prompt: string): Promise<string | null> {
  const classified = classifyFreeQuery(prompt);

  if (classified.type === 'none') return null;

  logger.info(`[FreeData] type=${classified.type} params=${JSON.stringify(classified.params)}`);

  try {
    switch (classified.type) {
      case 'crypto_price':
        return await fetchCryptoPrice(classified.params.coinId, classified.params.coinName);

      case 'gold_silver':
        return await fetchMetalPrice(classified.params.metal);

      case 'currency_rate':
        return await fetchCurrencyRate(classified.params.from, classified.params.to);

      case 'timezone':
        return await fetchTimezone(classified.params.location, classified.params.timezone);

      case 'country_info':
        return await fetchCountryInfo(classified.params.country);

      case 'wikipedia':
        return await fetchWikipedia(classified.params.query);

      default:
        return null;
    }
  } catch (err: any) {
    logger.warn(`[FreeData] ${classified.type} failed: ${err.message} — falling back to AI`);
    return null; // AI fallback
  }
}