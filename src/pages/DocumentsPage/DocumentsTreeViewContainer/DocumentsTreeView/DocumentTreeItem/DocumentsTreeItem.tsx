import React, { useCallback, useRef, useState } from 'react';
import { TreeItem, TreeItemContentProps, TreeItemProps, useTreeItem } from '@mui/x-tree-view/TreeItem';
import * as styles from './DocumentsTreeItem.module.scss';
import clsx from 'clsx';
import { IStoreDocument, StoreDocument } from '../../../../../store/documents/document';
import { IconButton, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddDocumentDialog from '../AddDocumentDialog/AddDocumentDialog';
import DeleteDocumentDialog from '../DeleteDocumentDialog/DeleteDocumentDialog';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useDrag, useDrop } from 'react-dnd';
import useStore from '../../../../../hooks/useStore';

type DocumentsTreeItemProps = TreeItemContentProps & { document?: StoreDocument };
type DocumentsTreeItem = TreeItemProps & { document?: StoreDocument };

const CustomContent = React.forwardRef(function CustomContent(props: DocumentsTreeItemProps, ref) {
	const { classes, className, nodeId, icon: iconProp, expansionIcon, displayIcon, document } = props;

	const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection } = useTreeItem(nodeId);

	const { documentsStore } = useStore();

	const icon = iconProp || expansionIcon || displayIcon;

	const handleMouseDown = useCallback(
		(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			preventSelection(event);
		},
		[preventSelection]
	);

	const handleExpansionClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			handleExpansion(event);
		},
		[handleExpansion]
	);

	const handleSelectionClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			if (!document) return;
			handleSelection(event);
		},
		[handleSelection]
	);

	const [addDocumentOpenDialog, setAddDocumentOpenDialog] = useState<boolean>(false);
	const [deleteDocumentOpenDialog, setDeleteDocumentOpenDialog] = useState<boolean>(false);

	const handleOpenAddDocument = useCallback(() => {
		setAddDocumentOpenDialog(true);
	}, [setAddDocumentOpenDialog]);

	const handleCloseAddDocument = useCallback(() => {
		setAddDocumentOpenDialog(false);
	}, []);

	const handleOpenDeleteDocument = useCallback(() => {
		setDeleteDocumentOpenDialog(true);
	}, [setDeleteDocumentOpenDialog]);

	const handleCloseDeleteDocument = useCallback(() => {
		setDeleteDocumentOpenDialog(false);
	}, []);

	const [_, drop] = useDrop({
		accept: 'item',
		drop: (item: IStoreDocument) => documentsStore.moveDocumentToFolder(item, document?.id!),
		canDrop: (_) => document?.isFolder === true,
	});

	const [__, drag] = useDrag({
		type: 'item',
		item: document,
		canDrag: () => !!document?.id,
	});

	const dndRef = useRef(null);

	drop(drag(dndRef));

	return (
		<div data-testid="documents-tree-item" onMouseDown={handleMouseDown} ref={ref as React.Ref<HTMLDivElement>}>
			<div ref={dndRef}>
				<div
					className={clsx(className, classes.root, styles.container, {
						[classes.expanded]: expanded,
						[classes.selected]: selected,
						[classes.focused]: focused,
						[classes.disabled]: disabled,
					})}
				>
					<div onClick={handleExpansionClick} className={classes.iconContainer}>
						{icon}
					</div>
					<div onClick={handleSelectionClick} className={classes.label}>
						{document != null ? (
							<div className={styles.labelWrapper}>
								<IconButton>
									<DragHandleIcon />
								</IconButton>
								<div className={styles.label}>{document.name}</div>

								<div className={styles.actionWrapper}>
									{document.isFolder && (
										<IconButton color="success" onClick={handleOpenAddDocument}>
											<AddIcon />
										</IconButton>
									)}
									<AddDocumentDialog open={addDocumentOpenDialog} folderId={document.id} close={handleCloseAddDocument} />
									<IconButton color="error" onClick={handleOpenDeleteDocument}>
										<RemoveIcon />
									</IconButton>
									<DeleteDocumentDialog open={deleteDocumentOpenDialog} document={document} close={handleCloseDeleteDocument} />
								</div>
							</div>
						) : (
							<Skeleton variant="text" sx={{ fontSize: '2rem' }} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
});

const DocumentsTreeItem = React.forwardRef(function CustomTreeItem(props: DocumentsTreeItem, ref: React.Ref<HTMLLIElement>) {
	return (
		<div>
			<TreeItem ContentComponent={CustomContent} ContentProps={{ document: props.document } as any} {...props} ref={ref} />
		</div>
	);
});

export default DocumentsTreeItem;
