import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useCallback, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { IStoreDocument } from '../../../../../store/documents/document';
import useStore from '../../../../../hooks/useStore';

type DeleteDocumentDialogProps = {
	open: boolean;
	document: IStoreDocument;
	close: () => void;
};

const DeleteDocumentDialog: React.FC<DeleteDocumentDialogProps> = (props) => {
	const [isLoading, setIsLoading] = useState(false);

	const { documentsStore } = useStore();

	const cancel = useCallback(() => {
		props.close();
	}, [props.close]);

	const onDeleteDocument = useCallback(async () => {
		setIsLoading(true);
		await documentsStore.deleteDocument(props.document.id!);
		setIsLoading(false);
		props.close();
	}, [documentsStore, props.close, setIsLoading]);

	return (
		<Dialog open={props.open}>
			<DialogTitle>Add New</DialogTitle>
			<DialogContent>
				<DialogContentText>Are you sure want to remove?</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={cancel}>Cancel</Button>
				<LoadingButton loading={isLoading} onClick={onDeleteDocument} color="error">
					Remove
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteDocumentDialog;
