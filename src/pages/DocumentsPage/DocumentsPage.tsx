import React, { useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import * as styles from './DocumentsPage.module.scss';
import DocumentsTreeViewContainer from './DocumentsTreeViewContainer/DocumentsTreeViewContainer';
import useStore from '../../hooks/useStore';

const DocumentsPage = observer(() => {
	const { documentsStore } = useStore();

	useEffect(() => {
		documentsStore.loadDocuments();
	}, []);

	return (
		<div className={styles.container}>
			<DocumentsTreeViewContainer />
		</div>
	);
});

export default DocumentsPage;
