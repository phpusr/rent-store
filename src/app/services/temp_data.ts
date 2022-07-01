import { AppState } from '../interfaces/general'

export const tmpStore: AppState = {
  flats: [
    { id: 1, address: 'Levina 231', number: '121' },
    { id: 2, address: 'Ludviga 34', number: '45' }
  ],
  currentFlatId: 1,
  currentYear: 2021,
  calculations: [
    {
      flatId: 1,
      year: 2020,
      month: 1,
      hcs: {
        electricity: 1238,
        electricityMonthly: 90,
        cost: 0
      },
      water: {
        coldVolume: 38,
        coldVolumeMonthly: 2,
        hotVolume: 18,
        hotVolumeMonthly: 2,
        cost: 161.8
      }
    }, {
      flatId: 1,
      year: 2021,
      month: 1,
      hcs: {
        electricity: 2312,
        electricityMonthly: 100,
        cost: 1165.59
      },
      water: {
        coldVolume: 69,
        coldVolumeMonthly: 3,
        hotVolume: 35,
        hotVolumeMonthly: 2,
        cost: 285.2
      }
    }
  ]
}
