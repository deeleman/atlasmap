import { FieldMappingPair, MappedField } from '../../models/mapping.model';
import { ConfigModel } from '../../models/config.model';
import { FieldAction, FieldActionConfig } from '../../models/transition.model';
export declare class MappingFieldActionComponent {
    cfg: ConfigModel;
    mappedField: MappedField;
    isSource: boolean;
    fieldPair: FieldMappingPair;
    getMappedFieldActions(): FieldAction[];
    getActionDescription(fieldAction: FieldAction): string;
    actionsExistForField(): boolean;
    getActionConfigs(): FieldActionConfig[];
    removeAction(action: FieldAction): void;
    selectionChanged(event: MouseEvent): void;
    addTransformation(): void;
    configSelectionChanged(event: any): void;
}
