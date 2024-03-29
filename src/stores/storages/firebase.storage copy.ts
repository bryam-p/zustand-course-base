import { StateStorage, createJSONStorage } from 'zustand/middleware';

const fireBaseUrl = 'https://zustand-storage-36536-default-rtdb.firebaseio.com/zustand';

const storageApi: StateStorage = {
  getItem: async function ( name: string ): Promise<string | null> {
    try {
      const data = await fetch( `${ fireBaseUrl }/${ name }.json` ).then( res => res.json() );
      return JSON.stringify( data );
    } catch ( err ) {
      console.log( err );
      throw err;
    }
  },

  setItem: async function ( name: string, value: string ): Promise<void> {
    await fetch( `${ fireBaseUrl }/${ name }.json`, {
      method: 'PUT',
      body: value
    } ).then( res => res.json() );
  },

  removeItem: function ( name: string ) {
    sessionStorage.removeItem( name );
  }
};

export const customFireBaseStorage = createJSONStorage( () => storageApi );