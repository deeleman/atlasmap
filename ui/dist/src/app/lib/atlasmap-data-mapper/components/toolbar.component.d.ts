import { ConfigModel } from '../models/config.model';
import { LineMachineComponent } from './line.machine.component';
import { ModalWindowComponent } from './modal.window.component';
export declare class ToolbarComponent {
    cfg: ConfigModel;
    lineMachine: LineMachineComponent;
    modalWindow: ModalWindowComponent;
    getCSSClass(action: string): string;
    targetSupportsTemplate(): boolean;
    toolbarButtonClicked(action: string, event: any): void;
    private editTemplate();
}
