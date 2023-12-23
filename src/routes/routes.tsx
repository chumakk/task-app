import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DocumentsPage from '../pages/DocumentsPage/DocumentsPage';
import ErrorPage from '../pages/ErrorPage/ErrorPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <DocumentsPage />,
	},
	{
		path: '*',
		element: <ErrorPage />,
	},
]);
