import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest, Subject, take } from 'rxjs'
import { Calculation, Flat } from '../interfaces/general'
import { LocalStorageService } from './local_storage.service'


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  calculations$: BehaviorSubject<Calculation[]>
  flats$: BehaviorSubject<Flat[]>
  currentFlatId$: BehaviorSubject<number | null>
  currentFlat$: BehaviorSubject<Flat | null | undefined>
  flatCalculations$: BehaviorSubject<Calculation[]>
  flatYearCalculations$: BehaviorSubject<Calculation[]>
  years$: BehaviorSubject<number[]>
  currentYear$: BehaviorSubject<number | null>

  constructor() {
    this.flats$ = new BehaviorSubject<Flat[]>([])
    this.currentFlatId$ = new BehaviorSubject<number | null>(null)
    this.currentFlat$ = new BehaviorSubject<Flat | null | undefined>(null)
    this.calculations$ = new BehaviorSubject<Calculation[]>([])
    this.flatCalculations$ = new BehaviorSubject<Calculation[]>([])
    this.flatYearCalculations$ = new BehaviorSubject<Calculation[]>([])
    this.years$ = new BehaviorSubject<number[]>([])
    this.currentYear$ = new BehaviorSubject<number | null>(null)

    // Current Flat syncing
    combineLatest([
      this.currentFlatId$,
      this.flats$
    ]).subscribe(([currentFlatId, flats]) => {
      if (currentFlatId == null) {
        this.currentFlat$.next(null)
        return
      }

      const currentFlat = flats.find(it => it.id === currentFlatId)
      this.currentFlat$.next(currentFlat)
    })

    // Flat Calculations syncing
    combineLatest([
      this.calculations$,
      this.currentFlatId$
    ]).subscribe(([calculations, flatId]) => {
      if (!flatId) {
        this.flatCalculations$.next([])
        return
      }

      const flatCalculations = calculations.filter(it => it.flatId === flatId)
      this.flatCalculations$.next(flatCalculations)
    })
    combineLatest([
      this.flatCalculations$,
      this.currentYear$
    ]).subscribe(([calculations, year]) => {
      if (!year) {
        this.flatYearCalculations$.next([])
        return
      }

      const yearCalculations = calculations.filter(it => it.year == year)
      this.flatYearCalculations$.next(yearCalculations)
    })

    // Syncing years
    this.flatCalculations$.subscribe(flatCalculations => {
      const minYear = Math.min(...flatCalculations.map(it => it.year))
      const maxYear = new Date().getFullYear() + 1
      const years = []
      for (let year = minYear; year <= maxYear; year++) {
        years.push(year)
      }
      this.years$.next(years)
    })
  }

  initValues() {
    this.flats$.next(LocalStorageService.flats)
    this.currentFlatId$.next(LocalStorageService.currentFlatId)
    this.currentYear$.next(LocalStorageService.currentYear)
    this.calculations$.next(LocalStorageService.calculations)
  }

  setCurrentFlatId(flatId: number) {
    this.currentFlatId$.next(flatId)
    LocalStorageService.currentFlatId = flatId
  }

  setCurrentYear(year: number) {
    this.currentYear$.next(year)
    LocalStorageService.currentYear = year
  }

  setFlats(newFlats: Flat[]) {
    this.flats$.next(newFlats)
    LocalStorageService.flats = newFlats
  }

  setFlatCalculations(newFlatCalculations: Calculation[]) {
    const flatId = this.currentFlatId$.getValue()
    if (!flatId) {
      return
    }

    const calculations = this.calculations$.getValue()
    const newCalculations = calculations.filter(it => it.flatId !== flatId)
    newCalculations.push(...newFlatCalculations)
    this.setCalculations(newCalculations)
  }

  setCalculations(newCalculations: Calculation[]) {
    this.calculations$.next(newCalculations)
    LocalStorageService.calculations = newCalculations
  }

  getMonthName(monthIndex: number): string {
    return new Date(1, monthIndex - 1, 1).toLocaleString('default', { month: 'long' })
  }

  saveCalculation(calc: Calculation) {
    const newCalculations = this.calculations$.getValue().filter(it =>
      it.flatId !== calc.flatId || it.year !== calc.year || it.month !== calc.month
    )
    newCalculations.push(calc)
    this.setCalculations(newCalculations)
  }

  deleteCalculation(calc: Calculation) {
    const newCalculations = this.calculations$.getValue().filter(it =>
      it.flatId !== calc.flatId || it.year !== calc.year || it.month !== calc.month
    )
    this.setCalculations(newCalculations)
  }

}
