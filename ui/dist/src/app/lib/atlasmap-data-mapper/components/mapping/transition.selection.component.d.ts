import { ConfigModel } from '../../models/config.model';
import { FieldMappingPair } from '../../models/mapping.model';
import { ModalWindowComponent } from '../modal.window.component';
export declare class TransitionSelectionComponent {
    cfg: ConfigModel;
    modalWindow: ModalWindowComponent;
    fieldPair: FieldMappingPair;
    private modes;
    private delimeters;
    selectionChanged(event: any): void;
    private modeIsEnum();
    private modeIsCombine();
    private getMappedValueCount();
    private showLookupTable();
}
