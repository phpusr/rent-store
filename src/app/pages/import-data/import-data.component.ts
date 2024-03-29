import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { combineLatest, take } from 'rxjs'
import { Calculation } from 'src/app/interfaces/general'
import { DataStorageService } from 'src/app/services/data_storage.service'

const MAX_FILE_SIZE = 100 * 1024

@Component({
  selector: 'app-import-data',
  template: ''
})
export class ImportDataComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dialog.open(ImportDataDialog, {
      width: '400px'
    })
  }
}

@Component({
  selector: 'app-import-data-dialog',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataDialog implements OnInit {

  errorMessage = ''
  file?: File

  constructor(
    private dialogRef: MatDialogRef<ImportDataDialog>,
    private dataStorage: DataStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onFileSelected(value: any) {
    const file: File = value.files[0]
    if (!this.checkFile(file)) {
      return
    }

    this.file = file
  }

  onImportFile() {
    const flatId = this.dataStorage.currentFlatId$.getValue()
    if (!flatId) {
      alert('Flat wasn\'t selected')
      return
    }

    const reader = new FileReader()
    reader.onload = (e: any) => {
      const data = JSON.parse(new TextDecoder().decode(e.target.result))
      this.dataStorage.setFlats(data.flats)
      this.dataStorage.setCalculations(data.calculations)
      this.dataStorage.setCurrentFlatId(data.currentFlatId)
      this.dataStorage.setCurrentYear(data.currentYear)
    }
    reader.readAsArrayBuffer(this.file as Blob)
    this.onClose()
    alert('Import was successfully')
  }

  checkFile(file: File): boolean {
    if (file.size > MAX_FILE_SIZE) {
      this.errorMessage = `File size > ${MAX_FILE_SIZE}`
      return false
    }

    if (file.type !== 'application/json' || !file.name.endsWith('.json')) {
      this.errorMessage = 'File type is not json'
      return false
    }

    return true
  }

  onClose(): void {
    this.dialogRef.close()
    this.router.navigate(['..'])
  }

}
