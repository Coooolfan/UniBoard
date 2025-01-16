function cloneWithFallback<T>(obj: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj)
    } else {
        return JSON.parse(JSON.stringify(obj))
    }
}

export default cloneWithFallback