import { Component, QueryList, ViewContainerRef, Type, ComponentFactoryResolver, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConfigModel } from '../models/config.model';
export interface ModalWindowValidator {
    isDataValid(): boolean;
}
export declare class EmptyModalBodyComponent {
}
export declare class ModalWindowComponent implements AfterViewInit {
    private componentFactoryResolver;
    detector: ChangeDetectorRef;
    headerText: string;
    nestedComponentType: Type<any>;
    nestedComponentInitializedCallback: Function;
    okButtonHandler: Function;
    cancelButtonHandler: Function;
    cfg: ConfigModel;
    message: string;
    nestedComponent: Component;
    confirmButtonText: string;
    visible: boolean;
    myTarget: QueryList<ViewContainerRef>;
    private componentLoaded;
    constructor(componentFactoryResolver: ComponentFactoryResolver, detector: ChangeDetectorRef);
    ngAfterViewInit(): void;
    loadComponent(): void;
    closeClicked(event: MouseEvent): void;
    close(): void;
    show(): void;
    reset(): void;
    private buttonClicked(okClicked);
}
