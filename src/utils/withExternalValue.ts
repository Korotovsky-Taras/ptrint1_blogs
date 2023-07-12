export function withExternalValue<T>(initialValue: T, externalValue: T | any) : T {
    if (isNaN(externalValue)) {
        return  initialValue;
    }
    return externalValue === undefined ? initialValue : externalValue;
}