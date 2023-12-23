import { describe } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { documentApi } from '../../../api/documentApi';
jest.mock('../../../api/documentApi');
const documentApiGetAll = jest.mocked(documentApi.getAll);
import DocumentsSearch from '../DocumentsTreeViewContainer/DocumentsSearch/DocumentsSearch';
import DocumentsTreeView from '../DocumentsTreeViewContainer/DocumentsTreeView/DocumentsTreeView';
import { StoreContext } from '../../../context/store';
import { Store } from '../../../store/store';
import { IStoreDocument } from '../../../store/documents/document';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

jest.useFakeTimers();

const renderSearchComponent = (store: Store) => {
	return render(
		<StoreContext.Provider value={store}>
			<DocumentsSearch />
			<DndProvider backend={HTML5Backend}>
				<DocumentsTreeView />
			</DndProvider>
		</StoreContext.Provider>
	);
};

describe('Documents Search', () => {
	let store: Store;

	beforeEach(() => {
		store = new Store();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Documents Search Component is in the document', () => {
		const { getByTestId } = renderSearchComponent(store);
		const searchComponent = getByTestId('documents-search').querySelector('input');
		expect(searchComponent).toBeInTheDocument();
	});

	const getAllRes = [
		{
			id: 'ca52ba3b-22cf-4e66-9791-ab0e296d01c1',
			name: 'File#1',
			isFolder: false,
			folderId: null,
			documentIds: [],
		},
		{
			id: 'eec4012b-3af8-40b0-a0a8-a8eb0f830f52',
			name: 'File#2',
			isFolder: false,
			folderId: null,
			documentIds: [],
		},
		{
			id: '7b20ac93-c0a4-4cbd-b843-c1b3680fc9f2',
			name: 'File#3',
			isFolder: false,
			folderId: null,
			documentIds: [],
		},
	] as IStoreDocument[];

	it('Documents Search Component value entered', async () => {
		const { getByTestId } = renderSearchComponent(store);
		const searchComponent = getByTestId('documents-search').querySelector('input')!;
		documentApiGetAll.mockResolvedValue(getAllRes);
		const searchValue = 'File#1';
		fireEvent.change(searchComponent, { target: { value: searchValue } });
		await waitFor(() => {
			expect(searchComponent).toHaveValue(searchValue);
		});
	});

	it('Documents Tree View documents rendered', async () => {
		const { getByTestId, queryAllByTestId } = renderSearchComponent(store);
		const searchComponent = getByTestId('documents-search').querySelector('input')!;
		const documentsRenderedOnStart = queryAllByTestId('documents-tree-item');
		expect(documentsRenderedOnStart.length).toBe(0);
		documentApiGetAll.mockResolvedValue(getAllRes);
		const searchValue = 'File#1';
		fireEvent.change(searchComponent, { target: { value: searchValue } });
		await waitFor(() => {
			const documentsRenderedOnStart = queryAllByTestId('documents-tree-item');
			expect(documentsRenderedOnStart.length).toBe(3);
		});
	});
});
