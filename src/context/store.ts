import { createContext } from 'react';
import { Store } from '../store/store';

export const StoreContext = createContext<Store>({} as Store);
export const StoreProvider = StoreContext.Provider;
