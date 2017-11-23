import { DocumentDefinition, NamespaceModel } from '../models/document.definition.model';
import { Field } from '../models/field.model';
import { ConfigModel } from '../models/config.model';
import { Observable } from 'rxjs/Observable';
import { ModalWindowValidator } from './modal.window.component';
export declare class FieldEditComponent implements ModalWindowValidator {
    cfg: ConfigModel;
    field: Field;
    parentField: Field;
    parentFieldName: String;
    isSource: boolean;
    fieldType: any;
    valueType: any;
    namespaceAlias: string;
    editMode: boolean;
    namespaces: NamespaceModel[];
    docDef: DocumentDefinition;
    dataSource: Observable<any>;
    constructor();
    initialize(field: Field, docDef: DocumentDefinition, isAdd: boolean): void;
    handleOnBlur(event: any): void;
    parentSelectionChanged(event: any): void;
    fieldTypeSelectionChanged(event: any): void;
    valueTypeSelectionChanged(event: any): void;
    namespaceSelectionChanged(event: any): void;
    executeSearch(filter: string): any[];
    getField(): Field;
    isDataValid(): boolean;
}
