import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest, Subject, take } from 'rxjs'
import { Calculation, Flat } from '../interfaces/general'
import { LocalStorageService } from './local_storage.service'


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  calculations$: BehaviorSubject<Calculation[]>
  flats$: Subject<Flat[]>
  currentFlatId$: BehaviorSubject<number | null>
  currentFlat$: Subject<Flat | null | undefined>
  flatCalculations$: BehaviorSubject<Calculation[]>
  flatYearCalculations$: BehaviorSubject<Calculation[]>
  years$: BehaviorSubject<number[]>
  currentYear$: Subject<number | null>

  constructor() {
    this.flats$ = new Subject<Flat[]>()
    this.currentFlatId$ = new BehaviorSubject<number | null>(null)
    this.currentFlat$ = new Subject<Flat | null | undefined>()
    this.calculations$ = new BehaviorSubject<Calculation[]>([])
    this.flatCalculations$ = new BehaviorSubject<Calculation[]>([])
    this.flatYearCalculations$ = new BehaviorSubject<Calculation[]>([])
    this.years$ = new BehaviorSubject<number[]>([])
    this.currentYear$ = new Subject<number | null>()

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
      const yearSet = new Set(flatCalculations.map(it => it.year))
      const years = Array.from(yearSet).sort((a, b) => a - b)
      this.years$.next(years)
    })
  }

  initValues() {
    this.flats$.next([
      { id: 1, address: 'Levina 231', number: '121' },
      { id: 2, address: 'Ludviga 34', number: '45' }
    ])
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

  setFlatCalculations(newFlatCalculations: Calculation[]) {
    combineLatest([
      this.calculations$,
      this.currentFlatId$
    ]).pipe(take(1)).subscribe(([calculations, flatId]) => {
      if (!flatId) {
        return
      }

      const newCalculations = calculations.filter(it => it.flatId !== flatId)
      newCalculations.push(...newFlatCalculations)
      this.setCalculations(newCalculations)
    })
  }

  setCalculations(newCalculations: Calculation[]) {
    this.calculations$.next(newCalculations)
    LocalStorageService.calculations = newCalculations
  }

  getMonthName(monthIndex: number): string {
    return new Date(1, monthIndex - 1, 1).toLocaleString('default', { month: 'long' })
  }

  saveCalculation(calc: Calculation) {
    this.calculations$.pipe(take(1)).subscribe(calculations => {
      const newCalculations = calculations.filter(it =>
        it.flatId !== calc.flatId || it.year !== calc.year || it.month !== calc.month
      )
      newCalculations.push(calc)
      this.setCalculations(newCalculations)
    })
  }

}
