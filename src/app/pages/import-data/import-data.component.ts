import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'
import { DataStorageService } from 'src/app/services/data_storage.service'

const MAX_FILE_SIZE = 100 * 1024

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataDialog implements OnInit {

  errorMessage = ''
  file?: File

  constructor(
    private dialogRef: MatDialogRef<ImportDataDialog>,
    private dataStorage: DataStorageService
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
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const calculations = JSON.parse(new TextDecoder().decode(e.target.result))
      this.dataStorage.flatCalculations$.next(calculations)
    }

    reader.readAsArrayBuffer(this.file as Blob);
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

  onNoClick(): void {
    this.dialogRef.close();
  }

}
