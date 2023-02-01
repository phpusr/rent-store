import { Flat, Calculation } from '../interfaces/general'

export class LocalStorageService {

  static get currentFlatId(): number {
    return JSON.parse(localStorage.getItem('currentFlatId') || '1')
  }

  static set currentFlatId(flatId: number) {
    localStorage.setItem('currentFlatId', flatId.toString())
  }

  static get currentYear(): number {
    const currentDateYear = new Date().getFullYear()
    try {
      return JSON.parse(localStorage.getItem('currentYear') || currentDateYear.toString())
    } catch(e) {
      return currentDateYear
    }
  }

  static set currentYear(year: number) {
    localStorage.setItem('currentYear', year.toString())
  }

  static get flats(): Flat[] {
    return JSON.parse(localStorage.getItem('flats') || '[]')
  }

  static set flats(flats: Flat[]) {
    localStorage.setItem('flats', JSON.stringify(flats))
  }

  static get calculations(): Calculation[] {
    return JSON.parse(localStorage.getItem('calculations') || '[]')
  }

  static set calculations(calculations: Calculation[]) {
    localStorage.setItem('calculations', JSON.stringify(calculations))
  }

}
