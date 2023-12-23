import { makeAutoObservable, runInAction } from 'mobx';
import { documentApi } from '../../api/documentApi';
import { IStoreDocument, StoreDocument } from './document';
import { difference } from 'ramda';

export class DocumentsStore {
	isLoading = true;

	searchText = '';

	documents: StoreDocument[] = [];

	openDocumentSectionIds: string[] = [];

	constructor() {
		makeAutoObservable(this);
	}

	private syncDocs(docs: IStoreDocument[]) {
		const storeDocs = docs.map((d) => new StoreDocument(d.id!, d.name, d.isFolder, d.folderId, d.documentIds));
		const storeDocIds = new Set(storeDocs.map((d) => d.id));
		const documents = this.documents.filter((d) => !storeDocIds.has(d.id));
		documents.push(...storeDocs);
		this.documents = documents;
	}

	setOpenDocumentSectionIds(openDocumentSectionIds: string[]) {
		const justExpanded = difference(openDocumentSectionIds, this.openDocumentSectionIds);
		if (justExpanded.length !== 0 && this.searchText === '') {
			this.loadWithDocuments(justExpanded[0]);
		}
		this.openDocumentSectionIds = openDocumentSectionIds;
	}

	async loadDocuments(folderId: string | null = null) {
		this.isLoading = true;
		try {
			const docs = await documentApi.getAll(folderId, this.searchText);
			this.syncDocs(docs);
		} catch (e) {
			console.log(e);
		}
		this.isLoading = false;
	}

	async syncDocument(id: string) {
		const document = await documentApi.getOne(id);
		runInAction(() => {
			this.documents = this.documents.map((d) =>
				d.id === id ? new StoreDocument(document.id!, document.name, document.isFolder, document.folderId, document.documentIds) : d
			);
		});
	}

	async loadWithDocuments(folderId: string) {
		try {
			const [_, docs] = await Promise.all([this.syncDocument(folderId), documentApi.getAll(folderId, this.searchText)]);
			this.syncDocs(docs);
		} catch (e) {
			console.log(e);
		}
	}

	async onSearchTextChange(searchText: string) {
		this.searchText = searchText;
		this.documents = [];
		this.loadDocuments();
	}

	async saveDocument(document: IStoreDocument) {
		try {
			await documentApi.save(document);
			if (document.folderId === null) {
				this.loadDocuments();
			} else {
				if (this.openDocumentSectionIds.includes(document.folderId)) {
					this.loadWithDocuments(document.folderId);
				} else {
					this.syncDocument(document.folderId);
				}
			}
		} catch (e) {
			console.log(e);
		}
	}

	async deleteDocument(id: string) {
		try {
			await documentApi.delete(id);
			const document = this.documents.find((d) => d.id === id)!;
			runInAction(() => {
				this.documents = this.documents.filter((d) => d.id !== id);
			});
			if (document.folderId === null) {
				this.loadDocuments();
			} else {
				if (this.openDocumentSectionIds.includes(document.folderId)) {
					this.loadWithDocuments(document.folderId);
				} else {
					this.syncDocument(document.folderId);
				}
			}
		} catch (e) {
			console.log(e);
		}
	}

	async moveDocumentToFolder(doc: IStoreDocument, folderId: string | null) {
		try {
			if (doc.folderId === folderId) return;
			await documentApi.moveDocumentToFolder(doc.id!, folderId);
			const docsToSync = [doc.id, doc.folderId, folderId].filter((id) => id !== null) as string[];
			await Promise.all(docsToSync.map((id) => this.syncDocument(id)));
		} catch (e) {
			console.log(e);
		}
	}
}
