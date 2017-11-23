import { Component, QueryList } from '@angular/core';
import { MappingModel, FieldMappingPair } from '../../models/mapping.model';
import { ConfigModel } from '../../models/config.model';
import { Field } from '../../models/field.model';
import { ModalWindowComponent } from '../modal.window.component';
export declare class MappingSelectionSectionComponent {
    outputNumber: number;
    mapping: MappingModel;
    selectedCallback: Function;
    selected: boolean;
    selectedFieldIsSource: boolean;
    parentComponent: Component;
    isOddRow: boolean;
    getClass(): string;
    getSourceTargetLabelText(isSource: boolean, fieldPair: FieldMappingPair): string;
    getFormattedOutputPath(path: string, nameOnly: boolean): string;
    handleMouseClick(event: MouseEvent): void;
}
export declare class MappingSelectionComponent {
    modalWindow: ModalWindowComponent;
    mappings: MappingModel[];
    selectedField: Field;
    cfg: ConfigModel;
    sectionComponents: QueryList<MappingSelectionSectionComponent>;
    private selectedMappingComponent;
    selectionChanged(c: MappingSelectionSectionComponent): void;
    getFormattedOutputPath(path: string, nameOnly: boolean): string;
    addMapping(): void;
    getSelectedMapping(): MappingModel;
    private getSelectedMappingComponent();
}
