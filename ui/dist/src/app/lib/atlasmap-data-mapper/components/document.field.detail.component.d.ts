import { ElementRef, QueryList } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ConfigModel } from '../models/config.model';
import { Field } from '../models/field.model';
import { LineMachineComponent } from './line.machine.component';
import { ModalWindowComponent } from './modal.window.component';
export declare class DocumentFieldDetailComponent {
    private sanitizer;
    cfg: ConfigModel;
    field: Field;
    lineMachine: LineMachineComponent;
    modalWindow: ModalWindowComponent;
    fieldDetailElement: ElementRef;
    fieldComponents: QueryList<DocumentFieldDetailComponent>;
    private isDragDropTarget;
    constructor(sanitizer: DomSanitizer);
    startDrag(event: any): void;
    dragEnterLeave(event: any, entering: boolean): void;
    allowDrop(event: any): void;
    endDrag(event: any): void;
    getFieldTypeIcon(): string;
    fieldShouldBeVisible(): boolean;
    getTransformationClass(): string;
    getMappingClass(): string;
    getCssClass(): string;
    getElementPosition(): any;
    handleMouseOver(event: MouseEvent): void;
    getParentToggleClass(): string;
    handleMouseClick(event: MouseEvent): void;
    getFieldDetailComponent(field: Field): DocumentFieldDetailComponent;
    editField(event: any): void;
    removeField(event: any): void;
    getSpacerWidth(): SafeStyle;
}
