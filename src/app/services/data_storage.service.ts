import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest } from 'rxjs'
import { Calculation, Flat } from '../interfaces/general'
import { LocalStorageService } from './local_storage.service'


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  isSplitMode$: BehaviorSubject<boolean>
  isDarkMode$: BehaviorSubject<boolean>
  flats$: BehaviorSubject<Flat[]>
  currentFlatId$: BehaviorSubject<number | null>
  currentFlat$: BehaviorSubject<Flat | null | undefined>
  years$: BehaviorSubject<number[]>
  currentYear$: BehaviorSubject<number | null>
  calculations$: BehaviorSubject<Calculation[]>
  flatCalculations$: BehaviorSubject<Calculation[]>
  flatYearCalculations$: BehaviorSubject<Calculation[]>
  splitYear$: BehaviorSubject<number | null>
  splitFlatYearCalculations$: BehaviorSubject<Calculation[]>

  constructor() {
    this.isSplitMode$ = new BehaviorSubject<boolean>(false)
    this.isDarkMode$ = new BehaviorSubject<boolean>(false)
    this.flats$ = new BehaviorSubject<Flat[]>([])
    this.currentFlatId$ = new BehaviorSubject<number | null>(null)
    this.currentFlat$ = new BehaviorSubject<Flat | null | undefined>(null)
    this.years$ = new BehaviorSubject<number[]>([])
    this.currentYear$ = new BehaviorSubject<number | null>(null)
    this.calculations$ = new BehaviorSubject<Calculation[]>([])
    this.flatCalculations$ = new BehaviorSubject<Calculation[]>([])
    this.flatYearCalculations$ = new BehaviorSubject<Calculation[]>([])
    this.splitYear$ = new BehaviorSubject<number | null>(null)
    this.splitFlatYearCalculations$ = new BehaviorSubject<Calculation[]>([])

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
    combineLatest([
      this.flatCalculations$,
      this.splitYear$
    ]).subscribe(([calculations, year]) => {
      if (!year) {
        this.splitFlatYearCalculations$.next([])
        return
      }

      const yearCalculations = calculations.filter(it => it.year == year)
      this.splitFlatYearCalculations$.next(yearCalculations)
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
    this.isDarkMode$.next(LocalStorageService.isDarkMode)
    this.flats$.next(LocalStorageService.flats)
    this.currentFlatId$.next(LocalStorageService.currentFlatId)
    this.currentYear$.next(LocalStorageService.currentYear)
    this.calculations$.next(LocalStorageService.calculations)
  }

  setSplitYear(value: number | null) {
    this.isSplitMode$.next(!!value)
    this.splitYear$.next(value)
  }

  setIsDarkMode(value: boolean) {
    this.isDarkMode$.next(value)
    LocalStorageService.isDarkMode = value
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
