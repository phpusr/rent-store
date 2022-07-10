import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest, Subject, take } from 'rxjs'
import { AppState, Calculation, Flat } from '../interfaces/general'


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  calculations$: BehaviorSubject<Calculation[]>
  flats$: Subject<Flat[]>
  currentFlatId$: BehaviorSubject<number | null>
  currentFlat$: Subject<Flat | null | undefined>
  flatCalculations$: Subject<Calculation[]>
  flatYearCalculations$: Subject<Calculation[]>
  years$: BehaviorSubject<number[]>
  currentYear$: Subject<number | null>
  currentYearIndex$: Subject<number | null>

  constructor() {
    this.flats$ = new Subject<Flat[]>()
    this.currentFlatId$ = new BehaviorSubject<number | null>(null)
    this.currentFlat$ = new Subject<Flat | null | undefined>()
    this.calculations$ = new BehaviorSubject<Calculation[]>([])
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

  initValues() {
    this.flats$.next([
      { id: 1, address: 'Levina 231', number: '121' },
      { id: 2, address: 'Ludviga 34', number: '45' }
    ])
    this.currentFlatId$.next(JSON.parse(localStorage.getItem('currentFlatId') || '1'))
    this.currentYear$.next(JSON.parse(localStorage.getItem('currentYear') || new Date().getFullYear().toString()))
    this.calculations$.next(JSON.parse(localStorage.getItem('calculations') || '[]'))
  }

  setCurrentFlatId(flatId: number) {
    this.currentFlatId$.next(flatId)
    localStorage.setItem('currentFlatId', flatId.toString())
  }

  setCurrentYearIndex(yearIndex: number) {
    this.years$.pipe(take(1)).subscribe(years => {
      this.currentYear$.next(years[yearIndex])
      localStorage.setItem('currentYear', years[yearIndex].toString())
    })
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
      this.calculations$.next(newCalculations)
      localStorage.setItem('calculations', JSON.stringify(newCalculations))
    })
  }

}
