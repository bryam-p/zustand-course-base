import { StateStorage, createJSONStorage } from 'zustand/middleware';

const storageApi: StateStorage = {
  getItem: function ( name: string ): string | Promise<string | null> | null {
    const data = sessionStorage.getItem( name );
    return data;
  },

  setItem: function ( name: string, value: string ) {
    console.log( 'setItem', name, value );
    sessionStorage.setItem( name, value );
  },

  removeItem: function ( name: string ) {
    sessionStorage.removeItem( name );
  }
};

export const customSessionStorage = createJSONStorage( () => storageApi );