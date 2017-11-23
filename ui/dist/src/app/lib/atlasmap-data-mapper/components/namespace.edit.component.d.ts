import { NamespaceModel } from '../models/document.definition.model';
import { ModalWindowValidator } from './modal.window.component';
export declare class NamespaceEditComponent implements ModalWindowValidator {
    namespace: NamespaceModel;
    targetEnabled: boolean;
    initialize(namespace: NamespaceModel, namespaces: NamespaceModel[]): void;
    targetToggled(): void;
    isDataValid(): boolean;
}
