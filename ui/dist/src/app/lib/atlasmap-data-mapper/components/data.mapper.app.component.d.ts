import { OnInit, ChangeDetectorRef } from '@angular/core';
import { ConfigModel } from '../models/config.model';
import { ToolbarComponent } from './toolbar.component';
import { DataMapperErrorComponent } from './data.mapper.error.component';
import { LineMachineComponent } from './line.machine.component';
import { ModalWindowComponent } from './modal.window.component';
import { DocumentDefinitionComponent } from './document.definition.component';
import { MappingDetailComponent } from './mapping/mapping.detail.component';
export declare class DataMapperAppComponent implements OnInit {
    detector: ChangeDetectorRef;
    lineMachine: LineMachineComponent;
    errorPanel: DataMapperErrorComponent;
    modalWindow: ModalWindowComponent;
    docDefInput: DocumentDefinitionComponent;
    docDefOutput: DocumentDefinitionComponent;
    mappingDetailComponent: MappingDetailComponent;
    toolbarComponent: ToolbarComponent;
    loadingStatus: string;
    constructor(detector: ChangeDetectorRef);
    getConfig(): ConfigModel;
    ngOnInit(): void;
    updateFromConfig(): void;
}
