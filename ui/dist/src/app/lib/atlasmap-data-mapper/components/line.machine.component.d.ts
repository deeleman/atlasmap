import { ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ConfigModel } from '../models/config.model';
import { DocumentDefinitionComponent } from './document.definition.component';
import { DocumentFieldDetailComponent } from './document.field.detail.component';
export declare class LineModel {
    sourceX: string;
    sourceY: string;
    targetX: string;
    targetY: string;
    stroke: string;
    style: SafeStyle;
}
export declare class LineMachineComponent implements OnInit {
    private sanitizer;
    detector: ChangeDetectorRef;
    cfg: ConfigModel;
    docDefInput: DocumentDefinitionComponent;
    docDefOutput: DocumentDefinitionComponent;
    lines: LineModel[];
    lineBeingFormed: LineModel;
    drawingLine: boolean;
    svgStyle: SafeStyle;
    lineMachineElement: ElementRef;
    private yOffset;
    constructor(sanitizer: DomSanitizer, detector: ChangeDetectorRef);
    ngOnInit(): void;
    addLineFromParams(sourceX: string, sourceY: string, targetX: string, targetY: string, stroke: string): void;
    addLine(l: LineModel): void;
    setLineBeingFormed(l: LineModel): void;
    clearLines(): void;
    drawLine(event: MouseEvent): void;
    drawCurrentLine(x: string, y: string): void;
    handleDocumentFieldMouseOver(component: DocumentFieldDetailComponent, event: any, isSource: boolean): void;
    mappingChanged(): void;
    redrawLinesForMappings(): void;
    private createLineStyle(l);
    private drawLinesForMapping(m);
    private getScreenPosForField(field, docDefComponent);
    private checkFieldEligibiltyForLineDrawing(field, description, m);
}
