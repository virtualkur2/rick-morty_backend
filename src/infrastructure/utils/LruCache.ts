export class LruCache<K,V> {
    private readonly cache: Map<K,V>;
    private readonly maxSize: number;

    constructor(maxSize: number) {
        if(maxSize <= 0) {
            throw new Error('LRUCache maxSize must be a positive integer');
        }
        this.maxSize = maxSize;
        this.cache = new Map<K,V>();
    }

    get(key: K): V | undefined {
        if(this.cache.has(key)) {
            const value = this.cache.get(key)!;
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
    }

    set(key: K, value: V): void {
        if(this.cache.has(key)) {
            // Hoist the entry to MRU
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Eviction by LRU
            const lruKey = this.cache.keys().next().value;
            if(lruKey) {
                this.cache.delete(lruKey);
            }
        }
        this.cache.set(key, value);
    }

    delete(key: K): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }

}