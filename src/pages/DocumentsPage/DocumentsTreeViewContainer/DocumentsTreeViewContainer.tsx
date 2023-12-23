import React from 'react';
import * as styles from './DocumentsTreeViewContainer.module.scss';
import DocumentsSearch from './DocumentsSearch/DocumentsSearch';
import { Divider } from '@mui/material';
import DocumentsTreeView from './DocumentsTreeView/DocumentsTreeView';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DocumentsTreeViewContainer = () => {
	return (
		<div className={styles.container}>
			<DocumentsSearch />
			<Divider variant="fullWidth" />
			<DndProvider backend={HTML5Backend}>
				<DocumentsTreeView />
			</DndProvider>
		</div>
	);
};

export default DocumentsTreeViewContainer;
