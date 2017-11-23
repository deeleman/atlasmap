import { OnInit } from '@angular/core';
import { ConfigModel } from '../../models/config.model';
import { Field } from '../../models/field.model';
import { FieldMappingPair, MappedField } from '../../models/mapping.model';
import { ModalWindowComponent } from '../modal.window.component';
import { CollapsableHeaderComponent } from '../collapsable.header.component';
export declare class SimpleMappingComponent {
    cfg: ConfigModel;
    isSource: boolean;
    fieldPair: FieldMappingPair;
    isAddButtonVisible(): boolean;
    getTopFieldTypeLabel(): string;
    getAddButtonLabel(): string;
    addClicked(): void;
    removePair(): void;
    removeMappedField(mappedField: MappedField): void;
}
export declare class CollectionMappingComponent {
    cfg: ConfigModel;
    fieldPairForEditing: FieldMappingPair;
    private animateLeft;
    private animateRight;
    getAnimationCSSClass(): string;
    getFields(fieldPair: FieldMappingPair, isSource: boolean): Field[];
    addClicked(): void;
    editPair(fieldPair: FieldMappingPair): void;
    exitEditMode(): void;
    removePair(fieldPair: FieldMappingPair): void;
}
export declare class MappingPairDetailComponent {
    cfg: ConfigModel;
    fieldPair: FieldMappingPair;
    modalWindow: ModalWindowComponent;
    sourcesHeader: CollapsableHeaderComponent;
    actionsHeader: CollapsableHeaderComponent;
    targetsHeader: CollapsableHeaderComponent;
}
export declare class MappingDetailComponent implements OnInit {
    cfg: ConfigModel;
    modalWindow: ModalWindowComponent;
    ngOnInit(): void;
    isMappingCollection(): boolean;
    private getTitle();
    private removeMapping(event);
    private selectMapping(field);
}
