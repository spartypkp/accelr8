/**
 * Cache times in seconds for different entity types
 */
export const CACHE_TIMES = {
	HOUSE: 60 * 5, // 5 minutes
	EVENT: 60, // 1 minute
	ROOM: 60 * 2, // 2 minutes
	USER: 60 * 10, // 10 minutes
	APPLICATION: 60 * 3, // 3 minutes
	PUBLIC: 60 * 60, // 1 hour for public content
	STATIC: 60 * 60 * 24, // 24 hours for static content
} as const;

/**
 * Generates Cache-Control headers for API responses
 */
export function getCacheHeaders(entityType: keyof typeof CACHE_TIMES): ResponseInit {
	return {
		headers: {
			'Cache-Control': `s-maxage=${CACHE_TIMES[entityType]}, stale-while-revalidate`
		}
	};
}

/**
 * No-cache headers for dynamic content that should never be cached
 */
export const NO_CACHE_HEADERS: ResponseInit = {
	headers: {
		'Cache-Control': 'no-store, max-age=0'
	}
};

/**
 * Short-lived cache (10 seconds) for frequently updated data
 * that benefits from some caching but needs to be fresh
 */
export const SHORT_CACHE_HEADERS: ResponseInit = {
	headers: {
		'Cache-Control': 's-maxage=10, stale-while-revalidate=30'
	}
};

/**
 * Generates Cache-Control headers with custom max-age time
 */
export function customCacheHeaders(maxAgeSeconds: number): ResponseInit {
	return {
		headers: {
			'Cache-Control': `s-maxage=${maxAgeSeconds}, stale-while-revalidate`
		}
	};
} 