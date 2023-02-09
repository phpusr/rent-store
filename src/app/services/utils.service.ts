import { Injectable } from '@angular/core';
import { Calculation } from '../interfaces/general'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getTotalCostCalculation(calc?: Calculation): number {
    return (calc?.hcs.cost || 0) + (calc?.water.cost || 0) + (calc?.heating.cost || 0) + (calc?.garbage.cost || 0) + (calc?.overhaul.cost || 0)
  }

}
