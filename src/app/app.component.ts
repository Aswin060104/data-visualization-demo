import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { ChartTypeRegistry, ChartType } from 'chart.js';
import * as XLSX from 'xlsx';
import { ExcelData } from './excelData.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  excelDataService : ExcelData = inject(ExcelData);

  title = 'data-visualization-demo';
  selectedOptionRow: string = '';
  selectedOptionColumn: string = '';
  chartType: ChartType = 'line';

  rowData: string[] = [];
  columnData: string[] = [];
  fieldNames: string[] = [];
  data: string[] = [];
  graph: boolean = false;
  itemCount: number = 0;

  // Selected fields to display
  selectedFields: boolean[] = [];
  displayedFieldNames: string[] = [];

  // Chart Data
  lineChartData = [
    {
      data: this.columnData,
      label: this.selectedOptionColumn,
    },
  ];
  lineChartLabels = this.rowData;
  lineChartOptions = {
    responsive: true,
  };
  lineChartColors = [
    {
      borderColor: 'rgba(0,99,132,1)',
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
  ];
  lineChartLegend = true;
  lineChartType = 'line';

  constructor(private cdr: ChangeDetectorRef) { }

  fetchValues(){

    const rowIndex: number = this.fieldNames.indexOf(this.selectedOptionRow);
    const columnIndex: number = this.fieldNames.indexOf(this.selectedOptionColumn);

    if (rowIndex === -1 || columnIndex === -1 && this.selectedOptionRow.length != 0 && this.selectedOptionColumn.length != 0) {
      console.error('Invalid row or column selection');
      return;
    }
     this.data = this.excelDataService.dataSet;
    // Prepare the data for the graph
    this.rowData = this.data.map((d, e) => {
      if ((this.itemCount != 0 && this.itemCount > e) || this.itemCount == 0)
        return d[rowIndex];
      else
        return null;
    }).filter((e): e is string => e !== null);

    this.columnData = this.data.map((d) => d[columnIndex] );
    console.log(this.rowData);
    console.log(this.columnData);
    console.log("In the fetch Value");
    
    
  }

  showGraph() {
    if (this.checkValidity() === false) {
      alert("Invalid Field values");
    }

    if(this.itemCount != 0){
      this.columnData.splice(this.itemCount);
      this.rowData.splice(this.itemCount);
    }
    this.lineChartData = [
      {
        data: this.columnData,
        label: this.selectedOptionColumn,
      },
      
    ];
    this.lineChartLabels = this.rowData;

    this.graph = true;
    console.log("HI " + this.itemCount);

    // Trigger Angular to update the view
    this.cdr.detectChanges();
  }

  checkValidity() {
    console.log(this.columnData);
    console.log(this.rowData);
    
    
    if (isNaN(Number(this.columnData[0])) && isNaN(Number(this.rowData[0]))  ) {
      console.log(Number(this.columnData[0]) + " " + Number(this.rowData[0]));
      this.graph = false;
      return false;
    }
    else
      return true;
  }

  ascendingSort() {

    this.fetchValues();

    if (!isNaN(Number(this.columnData[0]))) {
      const pair : Map<string,number> = new Map();
      for(let i = 0; i < this.rowData.length; i++){
          pair.set(this.rowData[i], (pair.get(this.rowData[i]) ?? 0) + Number(this.columnData[i]));
      }

      let sortedArray = Array.from(pair.entries()).sort((a, b) => b[1] - a[1]);

      let sortedPair : Map<string,number> = new Map(sortedArray);

      this.columnData.splice(0,this.columnData.length);
      this.rowData.splice(0,this.rowData.length);
      let index : number = 0;
      console.log(sortedArray);
      
      console.log(sortedPair);
      
      for(let key of sortedPair.keys()){
        this.rowData.push(key);
        this.columnData.push(sortedPair.get(key)?.toString() ?? '0');
        index++;
      }
      this.cdr.detectChanges();
      console.log("Ascending");
      console.log(this.rowData);
      console.log(this.columnData) ;
      this.itemCount = this.columnData.length;
    }
    else{
      alert("Invalid column value");
    }
    this.showGraph();
  }

  limitDisplayItems() {
    if (this.itemCount < 0)
      alert("Invalid Item count");
    else
      this.showGraph();
  }

  // Update the displayed fields based on user selection
  // updateDisplayedFields(): void {
  //   this.displayedFieldNames = this.fieldNames.filter((_, idx) => this.selectedFields[idx]);
  // }

  onFileChange(event: any): void {

    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      console.error('Cannot use multiple files');
      return;
    }

    const file: File = target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (d: any) => {
      const binaryData = d.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });

      // Assume the data is in the first sheet
      const sheetName: string = workbook.SheetNames[0];
      const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Extract field names and data
      if (jsonData.length > 0) {
        const header = jsonData[0] as string[];
        if (header && header.length > 0) {
          this.fieldNames = header;
          this.data = jsonData.slice(1).map((row) => row as string);

          // Initialize selected fields (by default, all are selected)
          this.selectedFields = Array(this.fieldNames.length).fill(true);
          this.excelDataService.setData(this.fieldNames, this.data);
        } else {
          console.error('Invalid file format: No headers found.');
        }
      } else {
        console.error('Invalid file format: Empty sheet.');
      }
    };
     reader.readAsBinaryString(file);
     
     console.log(this.fieldNames, this.data +" IN the onFileChange");
  }

}
