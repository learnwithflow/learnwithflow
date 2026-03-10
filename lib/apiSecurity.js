import { headers } from 'next/headers';

const RATE_LIMIT_MINUTES = 1;
const RATE_LIMIT_MAX_REQUESTS = 15;
const rateLimitMap = new Map();

// Helper to clean up old IP entries from the map
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
        if (now - data.startTime > RATE_LIMIT_MINUTES * 60 * 1000) {
            rateLimitMap.delete(ip);
        }
    }
}, 5 * 60 * 1000); // Clean every 5 mins

export function checkSecurity(req) {
    const headersList = headers();
    const providedSecret = headersList.get('x-api-secret');
    const requiredSecret = process.env.NEXT_PUBLIC_API_SECRET;

    // 1. Validate Secret Key
    if (!requiredSecret) {
        console.error('CRITICAL: NEXT_PUBLIC_API_SECRET is not set in environment variables!');
        // Allow in dev if not set, but block in production. 
        if (process.env.NODE_ENV === 'production') {
            return Response.json({ content: 'Server configuration error.' }, { status: 500 });
        }
    } else if (providedSecret !== requiredSecret) {
        return Response.json({ content: 'Unauthorized. Invalid API Secret.' }, { status: 401 });
    }

    // 2. In-Memory Rate Limiting based on IP
    const ip = headersList.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const now = Date.now();

    let ipData = rateLimitMap.get(ip);
    if (!ipData) {
        ipData = { count: 1, startTime: now };
        rateLimitMap.set(ip, ipData);
    } else {
        // Reset if timeframe passed
        if (now - ipData.startTime > RATE_LIMIT_MINUTES * 60 * 1000) {
            ipData.count = 1;
            ipData.startTime = now;
        } else {
            ipData.count++;
        }
    }

    if (ipData.count > RATE_LIMIT_MAX_REQUESTS) {
        return Response.json({ content: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // Valid request, return null error
    return null;
}
