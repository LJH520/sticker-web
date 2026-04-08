/* eslint-disable react-hooks/refs */
'use client';
import { State, Store } from './type';
import { createStore } from './store';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

type CreateStoreType = ReturnType<typeof createStore>;
const StoreContext = createContext<CreateStoreType | null>(null);

export const StoreProvider = ({
  children,
  name,
  state,
}: React.PropsWithChildren & {
  name: string;
  state?: Partial<State>;
}) => {
  const storeRef = useRef<CreateStoreType>(null);
  if (!storeRef.current) {
    storeRef.current = createStore(name, state);
  }
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
};

export function useStoreContext<T>(selector: (state: Store) => T): T {
  const store = useContext(StoreContext);
  if (!store) throw new Error('Missing Provider in the tree');
  return useStore(store, selector);
}
