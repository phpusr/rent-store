import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest, forkJoin, Subject } from 'rxjs'
import { AppState, Calculation, Flat } from '../interfaces/general'
import { tmpStore } from './temp_data'


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  private store: AppState
  private calculations$: Subject<Calculation[]>
  currentFlat$: Subject<Flat>
  flats$: BehaviorSubject<Flat[]>
  flatCalculations$: Subject<Calculation[]>

  constructor() {
    this.store = tmpStore
    this.currentFlat$ = new Subject<Flat>()
    this.flats$ = new BehaviorSubject<Flat[]>([])
    this.flats$.next(this.store.flats)
    this.calculations$ = new Subject<Calculation[]>()

    this.flatCalculations$ = new Subject<Calculation[]>()

    // Syncing flat calculations
    combineLatest([
      this.currentFlat$,
      this.calculations$
    ]).subscribe(([flat, calculations]) => {
      this.updateFlatCalculations(flat.id, calculations)
    })

  }

  private updateFlatCalculations(flatId: number, calculations: Calculation[]) {
    const flatCalculations = calculations.filter(it => it.flatId === flatId)
    this.flatCalculations$.next(flatCalculations)
  }

}
