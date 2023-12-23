import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';

import { StoreContext } from './context/store';
import { store } from './store/store';

import './assets/styles/common.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<React.StrictMode>
		<StoreContext.Provider value={store}>
			<RouterProvider router={router} />
		</StoreContext.Provider>
	</React.StrictMode>
);
