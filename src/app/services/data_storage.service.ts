import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest, Subject } from 'rxjs'
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
  years$: Subject<number[]>
  currentYear$: Subject<number | null>
  currentYearIndex$: Subject<number | null>

  constructor() {
    this.flats$ = new Subject<Flat[]>()

    // Current Flat syncing
    this.currentFlatId$ = new Subject<number | null>()
    this.currentFlat$ = new Subject<Flat | null | undefined>()
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
    this.calculations$ = new Subject<Calculation[]>()
    this.flatCalculations$ = new Subject<Calculation[]>()
    combineLatest([
      this.currentFlat$,
      this.calculations$
    ]).subscribe(([flat, calculations]) => {
      if (!flat) {
        return
      }

      this.updateFlatCalculations(flat.id, calculations)
    })

    // Syncing years
    this.years$ = new Subject<number[]>()
    this.flatCalculations$.subscribe(flatCalculations => {
      const yearSet = new Set(flatCalculations.map(it => it.year))
      const years = Array.from(yearSet).sort((a, b) => a - b)
      this.years$.next(years)
    })
    this.currentYear$ = new Subject<number | null>()
    this.currentYearIndex$ = new Subject<number | null>()
    combineLatest([
      this.currentYear$,
      this.years$
    ]).subscribe(([currentYear, years]) => {
      this.currentYearIndex$.next(years?.findIndex(it => it === currentYear))
    })
  }

  initValues(store: AppState) {
    this.flats$.next(store.flats)
    this.currentFlatId$.next(store.currentFlatId)
    this.currentYear$.next(store.currentYear)
    this.calculations$.next(store.calculations)
  }

  private updateFlatCalculations(flatId: number, calculations: Calculation[]) {
    const flatCalculations = calculations.filter(it => it.flatId === flatId)
    this.flatCalculations$.next(flatCalculations)
  }

}
