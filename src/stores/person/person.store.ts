import { type StateCreator, create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { customFireBaseStorage } from '../storages/firebase.storage copy';

interface PersonState {
  firstName: string;
  lastName: string;

  setFirstName: ( value: string ) => void;
  setLastName: ( value: string ) => void;
}

interface Actions {
  setFirstName: ( value: string ) => void;
  setLastName: ( value: string ) => void;
}

const storeAPI: StateCreator<PersonState & Actions, [ [ "zustand/devtools", never ] ]> = ( set ) => ( {
  firstName: '',
  lastName: '',

  setFirstName: ( value: string ) => set( state => ( { firstName: value } ), false, 'setFirstName' ),
  setLastName: ( value: string ) => set( state => ( { lastName: value } ), false, 'setLastName' ),
} );

export const usePersonStore = create<PersonState & Actions>()(
  devtools(
    persist(
      storeAPI,
      {
        name: 'person-storage',
        storage: customFireBaseStorage,
      }
    )
  )
);