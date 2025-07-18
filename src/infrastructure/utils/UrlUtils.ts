import { URLSearchParams } from 'url';

export function normalizeUrl(baseUrl: string, params: {[key: string]: any} = {}): string {
    const sortedParams = new URLSearchParams();
    const keys = Object.keys(params).sort((a, b) => a.localeCompare(b));
    for(const key of keys) {
        if(params[key] !== undefined && params[key] !== null) {
            sortedParams.append(key, String(params[key]))
        }
    }

    const queryString = sortedParams.toString();
    if(queryString) {
        return `${baseUrl}?${queryString}`;
    }
    return baseUrl;
}