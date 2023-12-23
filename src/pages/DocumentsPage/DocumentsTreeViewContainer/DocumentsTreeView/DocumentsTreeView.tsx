import React, { useCallback, useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import * as styles from './DocumentsTreeView.module.scss';
import DocumentsTreeItem from './DocumentTreeItem/DocumentsTreeItem';
import { observer } from 'mobx-react-lite';
import { IStoreDocument, StoreDocument } from '../../../../store/documents/document';
import useStore from '../../../../hooks/useStore';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddDocumentDialog from './AddDocumentDialog/AddDocumentDialog';
import { useDrop } from 'react-dnd';

const DocumentsTreeView = observer(() => {
	const { documentsStore } = useStore();

	useEffect(() => {
		if (documentsStore.searchText !== '') {
			documentsStore.setOpenDocumentSectionIds(documentsStore.documents.map((d) => d.id));
		}
	}, [documentsStore.documents]);

	useEffect(() => {
		if (documentsStore.searchText === '') {
			documentsStore.setOpenDocumentSectionIds([]);
		}
	}, [documentsStore.searchText]);

	const onNodeToggle = (_: React.SyntheticEvent, nodeIds: string[]) => {
		if (documentsStore.searchText !== '') return;
		documentsStore.setOpenDocumentSectionIds(nodeIds);
	};

	const generateDocumentTreeItem = (doc: StoreDocument) => {
		const documentIds = doc.documentIds;
		const documentsInside = documentIds.map((id) => documentsStore.documents.find((d) => d.id === id)).filter((d) => !!d) as StoreDocument[];

		return (
			<DocumentsTreeItem key={doc.id} nodeId={doc.id} document={doc}>
				{documentsInside.length != 0
					? documentsInside.map((d) => generateDocumentTreeItem(d))
					: documentIds.map((id) => <DocumentsTreeItem key={id} nodeId={id} />)}
			</DocumentsTreeItem>
		);
	};

	const [addDocumentOpenDialog, setAddDocumentOpenDialog] = useState<boolean>(false);

	const handleOpenAddDocument = useCallback(() => {
		setAddDocumentOpenDialog(true);
	}, [setAddDocumentOpenDialog]);

	const handleCloseAddDocument = useCallback(() => {
		setAddDocumentOpenDialog(false);
	}, [setAddDocumentOpenDialog]);

	const [_, drop] = useDrop({
		accept: 'item',
		drop: (item: IStoreDocument) => documentsStore.moveDocumentToFolder(item, null),
	});

	return (
		<div ref={drop} className={styles.container}>
			<div className={styles.actionWrapper}>
				<IconButton color="success" onClick={handleOpenAddDocument}>
					<AddIcon />
				</IconButton>
				<AddDocumentDialog open={addDocumentOpenDialog} folderId={null} close={handleCloseAddDocument} />
			</div>

			<TreeView
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				onNodeToggle={onNodeToggle}
				expanded={documentsStore.openDocumentSectionIds}
			>
				{documentsStore.documents.filter((doc) => doc.folderId === null).map((doc) => generateDocumentTreeItem(doc))}
			</TreeView>
		</div>
	);
});

export default DocumentsTreeView;
