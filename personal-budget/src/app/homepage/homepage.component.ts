import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataChart = {
    datasets: [{
        data: [],
        backgroundColor:[],
    }],

    labels: []
};
  private svg;
  private margin = 50;
  private width = 600;
  private height = 500;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;
  public data;

  constructor(public dataService: DataService) { }

  ngAfterViewInit(): void {
    if(this.dataService.myBudget.length == 0){
    this.dataService.getData()
    .subscribe((res: any) => {
      this.dataService.myBudget = res.MyBudget;
      for (let i = 0; i < res.myBudget.length; i++){
        this.dataChart.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataChart.labels[i] = res.myBudget[i].title;
        this.dataChart.datasets[0].backgroundColor[i] = res.myBudget[i].backgroundColor;
    }
      this.createChart();
      this.data = res.myBudget;
      this.createSvg();
      this.createColors();
      this.drawChart();
    });
  }
  else{
    console.log("It is coming to else part where the dataservice is already there");
    for(let i = 0; i < this.dataService.myBudget.length; i++){
      this.dataChart.datasets[0].data[i] = this.dataService.myBudget[i].budget;
      this.dataChart.labels[i] = this.dataService.myBudget[i].title;
      this.dataChart.datasets[0].backgroundColor[i] = this.dataService.myBudget[i].color;
    }
    this.createChart();

    this.data = this.dataService.myBudget;

    this.createSvg();
    this.createColors();
    this.drawChart();
  }
}

  // tslint:disable-next-line: typedef
  createChart() {
    // tslint:disable-next-line: quotemark
    const ctx = document.getElementById("myChart");
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataChart
    });
  }

  private createSvg(): void {
    this.svg = d3.select('figure#pie')
    .append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .append('g')
    .attr(
      'transform',
      'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
    );
}
private createColors(): void {
  this.colors = d3.scaleOrdinal()
  .domain(this.data.map(d => d.budget.toString()))
  .range(['#c7d3ec', '#a5b8db', '#879cc4', '#677795', '#5a6782']);
}

private drawChart(): void {
  // Compute the position of each group on the pie:

  const pie = d3.pie<any>().value((d: any) => Number(d.budget));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  .attr('fill', (d, i) => (this.colors(i)))
  .attr('stroke', '#121926')
  .style('stroke-width', '1px');

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('text')
  .text(d => d.data.title)
  .attr('transform', d => 'translate(' + labelLocation.centroid(d) + ')')
  .style('text-anchor', 'middle')
  .style('font-size', 15);
}



}
