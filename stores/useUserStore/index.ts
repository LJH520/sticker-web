import { createStore } from './store';
import { Store, Action, State } from './type';
import { StoreProvider, useStoreContext } from './context';

const useUserStore = createStore('useUserStore');
export default useUserStore;

export {
  createStore as createUserStore,
  StoreProvider as UserStoreProvider,
  useStoreContext as useUserStoreContext,
};

export type { Store as UserStore, Action as UserStoreAction, State as UserStoreState };
