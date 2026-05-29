import worldData from '$lib/data/countries-dataset.json';
import europeData from '$lib/data/countries-dataset-europe.json';
import asiaData from '$lib/data/countries-dataset-asia.json';
import africaData from '$lib/data/countries-dataset-africa.json';
import northAmericaData from '$lib/data/countries-dataset-north-america.json';
import southAmericaData from '$lib/data/countries-dataset-south-america.json';
import oceaniaData from '$lib/data/countries-dataset-oceania.json';

const REGION_DATA = {
    'World': worldData,
    'Europe': europeData,
    'Asia': asiaData,
    'Africa': africaData,
    'North America': northAmericaData,
    'South America': southAmericaData,
    'Oceania': oceaniaData,
};

export const REGION_COUNTS = {
    'World': 251,
    'Europe': 56,
    'Asia': 53,
    'Africa': 59,
    'North America': 38,
    'Oceania': 25,
    'South America': 18,
};

/**
 * Returns the number of flags to use for a game session.
 * @param {string} region
 * @param {'Full' | 'Half' | 'Quick'} length
 * @returns {number}
 */
export function getFlagCount(region, length) {
    const total = REGION_COUNTS[region] ?? 251;
    if (length === 'Quick') return 15;
    if (length === 'Half') return Math.floor(total / 2);
    return total;
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/** Returns all country entries for a region. */
export function getRegionFlags(region) {
    return REGION_DATA[region] ?? worldData;
}

/**
 * Returns a shuffled, length-sliced array of country entries for a game session.
 * @param {string} region
 * @param {'Full' | 'Half' | 'Quick'} length
 */
export function buildGame(region, length) {
    const all = getRegionFlags(region);
    const count = getFlagCount(region, length);
    return shuffle(all).slice(0, count);
}

/**
 * Returns 4 options (1 correct + 3 random wrong) in a shuffled order.
 * Wrong options are drawn from the full region pool so Quick games still
 * get varied distractors.
 * @param {object} correctCountry
 * @param {object[]} allCountries  full region pool
 */
export function getOptions(correctCountry, allCountries) {
    const wrong = shuffle(
        allCountries.filter(c => c.code !== correctCountry.code)
    ).slice(0, 3);
    return shuffle([correctCountry, ...wrong]);
}
