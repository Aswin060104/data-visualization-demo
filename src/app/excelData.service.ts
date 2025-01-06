import { Injectable } from "@angular/core";

@Injectable()
export class ExcelData{
    fieldData : string[] = [];
    dataSet : string[] = [];

    setData(fieldData : string[], rowData : string[]){
        this.fieldData = fieldData;
        this.dataSet = rowData;
        console.log(fieldData);
        console.log("In the service");
        
        
    }
}