import { AppState } from '../interfaces/general'

export const tmpStore: AppState = {
  flats: [
    { id: 1, address: 'Levina 231', number: '121' },
    { id: 2, address: 'Ludviga 34', number: '45' }
  ],
  currentFlatId: 1,
  calculations: []
}
