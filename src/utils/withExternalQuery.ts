import {SortingDirection} from "../types";

export function withExternalString(initialValue: string, externalValue: string | undefined) : string {
    if (externalValue === undefined) {
        return initialValue
    }
    return externalValue;
}

export function withExternalTerm(initialValue: string | null, externalValue: string | undefined) : string | null {
    if (externalValue === undefined) {
        return initialValue
    }
    return externalValue;
}

export function withExternalNumber(initialValue: number, externalValue: string | undefined) : number {
    if (externalValue === undefined) {
        return initialValue
    }
    if (isNaN(Number(externalValue))) {
        return initialValue;
    }
    return Number(externalValue);
}

export function withExternalDirection(initialValue: SortingDirection, externalValue: unknown | undefined) : SortingDirection {
    if (externalValue === undefined) {
        return initialValue
    }
    if (externalValue !== 'asc' && externalValue !== 'desc') {
        return initialValue
    }
    return externalValue;
}