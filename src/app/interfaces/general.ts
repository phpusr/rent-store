export interface AppState {
  flats: Flat[]
  calculations: Calculation[]
}

/* Квартира */
export interface Flat {
  id: number
  address: string
  number: 64
}

/* Расчеты */
export interface Calculation {
  flatId: number
  year: number
  month: number
  /* ЖКХ */
  hcs: {
    electricity: number
    electricityMonthly: number
    cost: number
  }
  /* Водоснабжение */
  water: {
    coldVolume: number
    coldVolumeMonthly: number
    hotVolume: number
    hotVolumeMonthly: number
    cost: number
  }
  /* Отопление */
  heating: {
    volume: number
    convertedVolume: number
    convertedVolumeMonthly: number
    cost: number
  }
  /* Вывоз мусора */
  garbage: {
    cost: number
  }
  /* Кап. ремонт */
  overhaul: {
    cost: number
  }
}
