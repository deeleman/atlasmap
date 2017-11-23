import { Field } from './field.model';
import { FieldMappingPair } from './mapping.model';
export declare class FieldActionArgument {
    name: string;
    type: string;
    serviceObject: any;
}
export declare class FieldActionArgumentValue {
    name: string;
    value: string;
}
export declare class FieldAction {
    static combineActionConfig: FieldActionConfig;
    static separateActionConfig: FieldActionConfig;
    isSeparateOrCombineMode: boolean;
    name: string;
    config: FieldActionConfig;
    argumentValues: FieldActionArgumentValue[];
    getArgumentValue(argumentName: string): FieldActionArgumentValue;
    setArgumentValue(argumentName: string, value: string): void;
    static createSeparateCombineFieldAction(separateMode: boolean, value: string): FieldAction;
}
export declare class FieldActionConfig {
    name: string;
    arguments: FieldActionArgument[];
    method: string;
    sourceType: string;
    targetType: string;
    serviceObject: any;
    appliesToField(field: Field, fieldPair: FieldMappingPair): boolean;
    populateFieldAction(action: FieldAction): void;
    getArgumentForName(name: string): FieldActionArgument;
}
export declare enum TransitionMode {
    MAP = 0,
    SEPARATE = 1,
    ENUM = 2,
    COMBINE = 3,
}
export declare enum TransitionDelimiter {
    NONE = 0,
    COLON = 1,
    COMMA = 2,
    MULTISPACE = 3,
    SPACE = 4,
}
export declare class TransitionDelimiterModel {
    delimiter: TransitionDelimiter;
    serializedValue: string;
    prettyName: string;
    constructor(delimiter: TransitionDelimiter, serializedValue: string, prettyName: string);
}
export declare class TransitionModel {
    static delimiterModels: TransitionDelimiterModel[];
    static actionConfigs: FieldActionConfig[];
    mode: TransitionMode;
    delimiter: TransitionDelimiter;
    lookupTableName: string;
    constructor();
    static getActionConfigForName(actionName: string): FieldActionConfig;
    static getTransitionDelimiterPrettyName(delimiter: TransitionDelimiter): string;
    getSerializedDelimeter(): string;
    setSerializedDelimeterFromSerializedValue(value: string): void;
    getPrettyName(): string;
    isSeparateMode(): boolean;
    isMapMode(): boolean;
    isCombineMode(): boolean;
    isEnumerationMode(): boolean;
}
