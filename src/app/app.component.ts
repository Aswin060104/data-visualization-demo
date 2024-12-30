import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'data-visualization-demo';
  lineChartData = [
    { 
      data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' 
    }
  ];
  lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartOptions = {
    responsive: true
  };
  lineChartColors = [
    {
      borderColor: 'rgba(0,99,132,1)',
      backgroundColor: 'rgba(0,0,0,0.2)'
    }
  ];
  lineChartLegend = true;
  lineChartType = 'line';

  radarChartData = [
    { data: [65, 59, 90, 81, 56, 55], label: 'Series A' }
  ];
  radarChartLabels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling'];
  radarChartOptions = {
    responsive: true
  };
  radarChartColors = [
    {
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      pointBackgroundColor: 'rgba(255,99,132,1)'
    }
  ];
  radarChartLegend = true;
  radarChartType = 'radar';

}
