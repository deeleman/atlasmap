import { TransitionMode, TransitionDelimiter } from '../../models/transition.model';
import { ConfigModel } from '../../models/config.model';
import { FieldMappingPair } from '../../models/mapping.model';
import { ModalWindowComponent } from '../modal.window.component';
export declare class TransitionSelectionComponent {
    cfg: ConfigModel;
    modalWindow: ModalWindowComponent;
    fieldPair: FieldMappingPair;
    modes: typeof TransitionMode;
    delimeters: typeof TransitionDelimiter;
    selectionChanged(event: any): void;
    modeIsEnum(): boolean;
    getMappedValueCount(): number;
    showLookupTable(): void;
}
