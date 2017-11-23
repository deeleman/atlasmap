import { Field } from '../models/field.model';
import { ModalWindowValidator } from './modal.window.component';
export declare class ConstantFieldEditComponent implements ModalWindowValidator {
    field: Field;
    valueType: any;
    initialize(field: Field): void;
    valueTypeSelectionChanged(event: any): void;
    getField(): Field;
    isDataValid(): boolean;
}
