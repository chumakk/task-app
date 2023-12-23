import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Switch, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import * as styles from './AddDocumentDialog.module.scss';
import LoadingButton from '@mui/lab/LoadingButton';
import { IStoreDocument } from '../../../../../store/documents/document';
import useStore from '../../../../../hooks/useStore';

type AddDocumentDialogProps = {
	open: boolean;
	folderId: string | null;
	close: () => void;
};

const defaultState = { id: null, name: '', isFolder: false, folderId: null, documentIds: [] };

const AddDocumentDialog: React.FC<AddDocumentDialogProps> = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [form, setForm] = useState<IStoreDocument>({ ...defaultState, folderId: props.folderId });

	const { documentsStore } = useStore();

	const cancel = useCallback(() => {
		setForm({ ...defaultState, folderId: props.folderId });
		props.close();
	}, [setForm, props.close]);

	const add = useCallback(async () => {
		setIsLoading(true);
		await documentsStore.saveDocument(form);
		setIsLoading(false);
		cancel();
	}, [setIsLoading, documentsStore, setIsLoading, cancel, form]);

	return (
		<Dialog open={props.open}>
			<DialogTitle>Add New</DialogTitle>
			<DialogContent className={styles.dialogContent}>
				<TextField
					label="Name"
					value={form.name}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: event.target.value })}
					fullWidth
				/>
				<FormControl fullWidth>
					<FormControlLabel
						control={
							<Switch
								checked={form.isFolder}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, isFolder: event.target.checked })}
							/>
						}
						label="Folder"
					/>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={cancel}>Cancel</Button>
				<LoadingButton loading={isLoading} onClick={add}>
					Create
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default AddDocumentDialog;
