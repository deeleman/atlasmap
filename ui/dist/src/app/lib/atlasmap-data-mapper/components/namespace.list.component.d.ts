import { ConfigModel } from '../models/config.model';
import { NamespaceModel } from '../models/document.definition.model';
import { ModalWindowComponent } from './modal.window.component';
export declare class NamespaceListComponent {
    cfg: ConfigModel;
    modalWindow: ModalWindowComponent;
    searchMode: boolean;
    private searchFilter;
    private selectedNamespace;
    private searchResults;
    getNamespaceCSSClass(namespace: NamespaceModel, index: number): string;
    searchResultsVisible(): boolean;
    selectNamespace(ns: NamespaceModel): void;
    getItemsCSSClass(): string;
    getRowTitleCSSClass(): string;
    getRowsCSSClass(): string;
    getNamespaces(): NamespaceModel[];
    addEditNamespace(ns: NamespaceModel, event: any): void;
    toggleSearch(): void;
    getSearchIconCSSClass(): string;
    namespaceMatchesSearch(ns: NamespaceModel): boolean;
    removeNamespace(ns: NamespaceModel, event: any): void;
    private search(searchFilter);
}
