import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource = {
      datasets: [
          {
              data: [],
              backgroundColor: []
          }
      ],
      labels: []
  };

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for (let i = 0; i < res.myBudget.length; i++){
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
        this.dataSource.datasets[0].backgroundColor[i] = res.myBudget[i].backgroundColor;
    }
      this.createChart();
    });
  }

  // tslint:disable-next-line: typedef
  createChart() {
    // tslint:disable-next-line: quotemark
    const ctx = document.getElementById("myChart");
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }

}
