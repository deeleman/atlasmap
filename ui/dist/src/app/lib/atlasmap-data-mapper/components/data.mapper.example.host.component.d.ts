import { OnInit } from '@angular/core';
import { InitializationService } from '../services/initialization.service';
import { DataMapperAppComponent } from './data.mapper.app.component';
export declare class DataMapperAppExampleHostComponent implements OnInit {
    private initializationService;
    dataMapperComponent: DataMapperAppComponent;
    constructor(initializationService: InitializationService);
    ngOnInit(): void;
}
