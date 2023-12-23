import { IStoreDocument } from '../store/documents/document';
import { generateId, sortArrayAlphabeticallyByProp } from '../utils/utils';
import { instance } from './api';
import jsonData from './data.json';

const useFakeApi = true;

const BASE_URL = '/documents';

class DocumentApi {
	constructor() {}

	async getAll(folderId: string | null, searchText: string) {
		const params: any = {};
		if (folderId !== null) params.folderId = folderId;
		if (searchText !== '') params.searchText = searchText;
		return instance.get(`${BASE_URL}`, { params: { folderId, searchText } }).then((res) => res.data as IStoreDocument[]);
	}

	async getOne(id: string) {
		return instance.get(`${BASE_URL}/${id}`).then((res) => res.data as IStoreDocument);
	}

	async save(doc: Partial<IStoreDocument>) {
		return instance.post(`${BASE_URL}`, JSON.stringify(doc)).then((res) => res.data);
	}

	async moveDocumentToFolder(docId: string, folderId: string | null) {
		return instance.post(`${BASE_URL}/move`, JSON.stringify({ docId, folderId })).then((res) => res.data);
	}

	async delete(id: string) {
		return instance.delete(`${BASE_URL}/${id}`).then((res) => res.data);
	}
}

const FAKE_OK_RES = { message: 'OK' };

const localStorageDataPath = 'test-app-data';

class DocumentFakeApi implements DocumentApi {
	constructor() {
		const data = localStorage.getItem(localStorageDataPath);
		if (data === null) {
			localStorage.setItem(localStorageDataPath, JSON.stringify(jsonData));
		}
	}

	private requestDelay = 200;
	private simulateRequest = <T>(func: () => any) => new Promise<T>((res) => setTimeout(() => res(func()), this.requestDelay));

	async getAll(folderId: string | null, searchText: string) {
		return this.simulateRequest<IStoreDocument[]>(() => {
			let data = JSON.parse(localStorage.getItem(localStorageDataPath)!) as IStoreDocument[];
			let dataIdsContainsSearchTextWithFolderIds = new Set<string>();
			if (searchText != '') {
				const getDocumentPathIds = (id: string): string[] => {
					const ids = [id];
					const document = data.find((d) => d.id === id)!;
					if (document.folderId !== null) {
						ids.push(...getDocumentPathIds(document.folderId));
					}

					if (document.isFolder === true) {
						ids.push(...document.documentIds);
					}
					return ids;
				};
				const dataIdsContainsSearchText = data.filter((d) => d.name.toLowerCase().includes(searchText.toLowerCase())).map((d) => d.id!);
				dataIdsContainsSearchText
					.map((id) => getDocumentPathIds(id!))
					.flat()
					.forEach((id) => dataIdsContainsSearchTextWithFolderIds.add(id));
				data = data
					.filter((d) => dataIdsContainsSearchTextWithFolderIds.has(d.id!))
					.map((d) => ({
						...d,
						documentIds: dataIdsContainsSearchText.includes(d.id!)
							? d.documentIds
							: d.documentIds.filter((id) => dataIdsContainsSearchTextWithFolderIds.has(id)),
					}));
			} else {
				data = data.filter((d) => d.folderId === folderId);
			}

			data = sortArrayAlphabeticallyByProp(data, 'name');

			return data;
		});
	}

	async getOne(id: string) {
		return this.simulateRequest<IStoreDocument>(() => {
			const data = JSON.parse(localStorage.getItem(localStorageDataPath)!) as IStoreDocument[];
			return data.find((d) => d.id === id);
		});
	}

	async save(doc: IStoreDocument) {
		return this.simulateRequest(() => {
			let data = JSON.parse(localStorage.getItem(localStorageDataPath)!) as IStoreDocument[];

			const id = doc.id !== null ? doc.id : generateId();
			if (doc.id != null) {
				data = data.map((d) => (d.id === id ? { ...d, ...doc } : d));
			} else {
				doc.id = id;
				data.push(doc);
				if (doc.folderId != null) {
					const folder = data.find((d) => d.id === doc.folderId);
					if (folder) {
						folder.documentIds.push(doc.id);
					}
				}
			}
			localStorage.setItem(localStorageDataPath, JSON.stringify(data));

			return { id };
		});
	}

	async moveDocumentToFolder(docId: string, folderId: string | null) {
		return this.simulateRequest(() => {
			let data = JSON.parse(localStorage.getItem(localStorageDataPath)!) as IStoreDocument[];

			const document = data.find((d) => d.id === docId);

			if (!document) return { docId };

			let currentFolder = data.find((d) => d.id === document.folderId);

			if (currentFolder) {
				currentFolder.documentIds = currentFolder.documentIds.filter((id) => id !== docId);
			}

			document.folderId = folderId;

			currentFolder = data.find((d) => d.id === document.folderId);

			if (currentFolder) {
				currentFolder.documentIds.push(docId);
			}

			localStorage.setItem(localStorageDataPath, JSON.stringify(data));

			return { docId };
		});
	}

	async delete(id: string) {
		return this.simulateRequest(() => {
			let data = JSON.parse(localStorage.getItem(localStorageDataPath)!) as IStoreDocument[];
			data = data.filter((d) => d.id !== id);
			data = data.filter((d) => d.folderId !== id);
			data = data.map((d) => ({ ...d, documentIds: d.documentIds.filter((docId) => docId !== id) }));
			localStorage.setItem(localStorageDataPath, JSON.stringify(data));
			return { FAKE_OK_RES };
		});
	}
}

export const documentApi = useFakeApi ? new DocumentFakeApi() : new DocumentApi();
