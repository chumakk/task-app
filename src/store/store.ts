import { DocumentsStore } from './documents/documents';

export class Store {
	documentsStore: DocumentsStore;
	constructor() {
		this.documentsStore = new DocumentsStore();
	}
}

export const store = new Store();
