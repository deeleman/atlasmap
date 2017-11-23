export declare class LookupTableEntry {
    sourceValue: string;
    sourceType: string;
    targetValue: string;
    targetType: string;
    toJSON(): any;
    fromJSON(json: any): void;
}
export declare class LookupTable {
    name: string;
    entries: LookupTableEntry[];
    sourceIdentifier: string;
    targetIdentifier: string;
    constructor();
    getInputOutputKey(): string;
    getEntryForSource(sourceValue: string, autocreate: boolean): LookupTableEntry;
    toString(): string;
}
