import React, { useCallback } from 'react';

import { observer } from 'mobx-react-lite';
import * as styles from './DocumentsSearch.module.scss';
import { TextField } from '@mui/material';
import useStore from '../../../../hooks/useStore';

const DocumentsSearch = observer(() => {
	const { documentsStore } = useStore();

	const onSearchTextChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			documentsStore.onSearchTextChange(event.target.value);
		},
		[documentsStore]
	);

	return (
		<div className={styles.container}>
			<TextField
				data-testid="documents-search"
				fullWidth
				label="Search"
				variant="outlined"
				value={documentsStore.searchText}
				onChange={onSearchTextChange}
			/>
		</div>
	);
});

export default DocumentsSearch;
