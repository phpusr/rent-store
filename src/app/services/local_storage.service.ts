import { Calculation } from '../interfaces/general'

export class LocalStorageService {

  static get currentFlatId(): number {
    return JSON.parse(localStorage.getItem('currentFlatId') || '1')
  }

  static set currentFlatId(flatId: number) {
    localStorage.setItem('currentFlatId', flatId.toString())
  }

  static get currentYear(): number {
    return JSON.parse(localStorage.getItem('currentYear') || new Date().getFullYear().toString())
  }

  static set currentYear(year: number) {
    localStorage.setItem('currentYear', year.toString())
  }

  static get calculations(): Calculation[] {
    return JSON.parse(localStorage.getItem('calculations') || '[]')
  }

  static set calculations(calculations: Calculation[]) {
    localStorage.setItem('calculations', JSON.stringify(calculations))
  }

}
