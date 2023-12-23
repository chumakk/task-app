import { useContext } from 'react';
import { Store } from '../store/store';
import { StoreContext } from '../context/store';

const useStore = (): Store => useContext(StoreContext);

export default useStore;
