import { Component, ChangeDetectorRef } from '@angular/core';
import { ChartTypeRegistry, ChartType } from 'chart.js';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'data-visualization-demo';
  selectedOptionRow: string = '';
  selectedOptionColumn: string = '';
  chartType: ChartType = 'line';

  rowData: string[] = [];
  columnData: string[] = [];
  fieldNames: string[] = [];
  data: Array<string[] | number[]> = [];
  graph: boolean = false;

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

  constructor(private cdr: ChangeDetectorRef) {}

  showGraph() {
    const indexRow: number = this.fieldNames.indexOf(this.selectedOptionRow);
    const indexColumn: number = this.fieldNames.indexOf(this.selectedOptionColumn);

    if (indexRow === -1 || indexColumn === -1) {
      console.error('Invalid row or column selection');
      return;
    }

    // Prepare the data for the graph
    this.columnData = this.data.map((d) => d[indexColumn] as string);
    this.rowData = this.data.map((d) => d[indexRow] as string);

    this.lineChartData = [
      {
        data: this.columnData,
        label: this.selectedOptionColumn,
      },
    ];
    this.lineChartLabels = this.rowData;

    this.graph = true;

    // Trigger Angular to update the view
    this.cdr.detectChanges();
  }

  // Handle file change and parse the excel data
  
  // Update the displayed fields based on user selection
  updateDisplayedFields(): void {
    this.displayedFieldNames = this.fieldNames.filter((_, idx) => this.selectedFields[idx]);
  }

  // Sorting function to sort data based on selected column
  sortData(index: number): void {
    const key = this.fieldNames[index]; // Field name to sort by
    const firstValue = this.data[0][index];
    const isNumeric = typeof firstValue === 'number' || !isNaN(Number(firstValue));

    this.data.sort((a, b) => {
      const aValue = a[index];
      const bValue = b[index];
  
      if (isNumeric) {
        // Numeric sorting
        return Number(aValue) - Number(bValue);
      } else {
        // String sorting
        return (aValue > bValue) ? 1 : (aValue < bValue) ? -1 : 0;
      }
    });
    // this.columnData = this.data as string[];
  }

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
          this.data = jsonData.slice(1).map((row) => row as string[] | number[]);

          // Initialize selected fields (by default, all are selected)
          this.selectedFields = Array(this.fieldNames.length).fill(true);
          this.updateDisplayedFields();
        } else {
          console.error('Invalid file format: No headers found.');
        }
      } else {
        console.error('Invalid file format: Empty sheet.');
      }
    };

    reader.readAsBinaryString(file);
  }

}
