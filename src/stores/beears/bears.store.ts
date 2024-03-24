import { create } from 'zustand';

interface Bear {
  id: number,
  name: string;
}

interface BearState {
  blackBears: number;
  polarBears: number;
  pandaBears: number;

  bears: Bear[];

  computed: {
    totalBears: number;
  },

  increaseBlackBears: ( by: number ) => void;
  increasePolarBears: ( by: number ) => void;
  increasePandaBears: ( by: number ) => void;

  doNothing: () => void;
  addBear: () => void;
  clearBear: () => void;
}

export const useBearStore = create<BearState>( ( set, get ) => ( {
  blackBears: 0,
  polarBears: 0,
  pandaBears: 0,
  bears: [ { id: 1, name: "oso" } ],
  increaseBlackBears: ( by: number ) => set( ( state ) => ( { blackBears: state.blackBears + by } ) ),
  increasePolarBears: ( by: number ) => set( ( state ) => ( { polarBears: state.polarBears + by } ) ),
  increasePandaBears: ( by: number ) => set( ( state ) => ( { pandaBears: state.pandaBears + by } ) ),
  doNothing: () => set( state => ( { bears: [ ...state.bears ] } ) ),
  addBear: () => set( state => ( {
    bears: [
      ...state.bears,
      {
        id: state.bears.length + 1,
        name: `Oso #${ state.bears.length + 1 }`
      }
    ]
  } ) ),
  clearBear: () => set( { bears: [] } ),
  computed: {
    get totalBears() {
      return get().blackBears + get().pandaBears + get().polarBears;
    }
  }
} ) );


