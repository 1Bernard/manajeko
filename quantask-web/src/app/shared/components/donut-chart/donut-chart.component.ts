import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-donut-chart',
    standalone: true,
    imports: [CommonModule, NgxEchartsModule],
    template: `
    <div echarts [options]="chartOptions" class="w-full h-full" [autoResize]="true"></div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class DonutChartComponent implements OnChanges {
    @Input() data: { name: string; value: number; color: string }[] = [];

    chartOptions: EChartsOption = {};

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            this.updateChartOptions();
        }
    }

    private updateChartOptions(): void {
        const total = this.data.reduce((acc, curr) => acc + curr.value, 0);

        this.chartOptions = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            series: [
                {
                    name: 'Tasks',
                    type: 'pie',
                    radius: ['60%', '80%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold',
                            formatter: '{c}'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: this.data.map(item => ({
                        value: item.value,
                        name: item.name,
                        itemStyle: { color: item.color }
                    }))
                }
            ],
            graphic: {
                type: 'text',
                left: 'center',
                top: 'center',
                style: {
                    text: total.toString(),
                    fill: '#1f2937',
                    fontSize: 24,
                    fontWeight: 'bold'
                }
            }
        };
    }
}
