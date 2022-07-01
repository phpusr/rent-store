import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest, Subject, take } from 'rxjs'
import { AppState, Calculation, Flat } from '../interfaces/general'


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  private calculations$: Subject<Calculation[]>
  flats$: Subject<Flat[]>
  currentFlatId$: Subject<number | null>
  currentFlat$: Subject<Flat | null | undefined>
  flatCalculations$: Subject<Calculation[]>
  flatYearCalculations$: Subject<Calculation[]>
  years$: BehaviorSubject<number[]>
  currentYear$: Subject<number | null>
  currentYearIndex$: Subject<number | null>

  constructor() {
    this.flats$ = new Subject<Flat[]>()
    this.currentFlatId$ = new Subject<number | null>()
    this.currentFlat$ = new Subject<Flat | null | undefined>()
    this.calculations$ = new Subject<Calculation[]>()
    this.flatCalculations$ = new Subject<Calculation[]>()
    this.flatYearCalculations$ = new Subject<Calculation[]>()
    this.years$ = new BehaviorSubject<number[]>([])
    this.currentYear$ = new Subject<number | null>()
    this.currentYearIndex$ = new Subject<number | null>()

    // Current Flat syncing
    combineLatest([
      this.currentFlatId$,
      this.flats$
    ]).subscribe(([currentFlatId, flats]) => {
      if (currentFlatId == null) {
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
    combineLatest([
      this.currentYear$,
      this.years$
    ]).subscribe(([currentYear, years]) => {
      this.currentYearIndex$.next(years?.findIndex(it => it === currentYear))
    })
  }

  changeCurrentYearIndex(yearIndex: number) {
    this.years$.pipe(take(1)).subscribe(years => {
      this.currentYear$.next(years[yearIndex])
    })
  }

  initValues(store: AppState) {
    this.flats$.next(store.flats)
    this.currentFlatId$.next(store.currentFlatId)
    this.currentYear$.next(store.currentYear)
    this.calculations$.next(store.calculations)
  }

}
