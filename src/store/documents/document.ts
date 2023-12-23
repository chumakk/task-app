import { makeAutoObservable } from 'mobx';

export interface IStoreDocument {
	id: string | null;
	name: string;
	isFolder: boolean;
	folderId: string | null;
	documentIds: string[];
}

export class StoreDocument implements IStoreDocument {
	id: string;
	name: string;
	isFolder: boolean;
	folderId: string | null;
	documentIds: string[];

	constructor(id: string, name: string, isFolder: boolean, folderId: string | null, documentIds: string[]) {
		makeAutoObservable(this);
		this.id = id;
		this.name = name;
		this.isFolder = isFolder;
		this.folderId = folderId;
		this.documentIds = documentIds;
	}
}
