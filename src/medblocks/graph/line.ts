// import { customElement, html, LitElement, property } from 'lit-element';
// import {
//   Chart,
//   ArcElement,
//   LineElement,
//   BarElement,
//   PointElement,
//   BarController,
//   BubbleController,
//   DoughnutController,
//   LineController,
//   PieController,
//   PolarAreaController,
//   RadarController,
//   ScatterController,
//   CategoryScale,
//   LinearScale,
//   LogarithmicScale,
//   RadialLinearScale,
//   TimeScale,
//   TimeSeriesScale,
//   Filler,
//   Legend,
//   Title,
//   Tooltip
// } from 'chart.js';

// Chart.register(
//   ArcElement,
//   LineElement,
//   BarElement,
//   PointElement,
//   BarController,
//   BubbleController,
//   DoughnutController,
//   LineController,
//   PieController,
//   PolarAreaController,
//   RadarController,
//   ScatterController,
//   CategoryScale,
//   LinearScale,
//   LogarithmicScale,
//   RadialLinearScale,
//   TimeScale,
//   TimeSeriesScale,
//   Filler,
//   Legend,
//   Title,
//   Tooltip
// );

// @customElement('mb-line')
// export default class MbLine extends LitElement {
//   @property({ type: Object }) myChart: any;

//   firstUpdated() {
//     const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
//     this.myChart = new Chart(canvas, {
//       type: 'bar',
//       data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [
//           {
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//               'rgba(255, 99, 132, 0.2)',
//               'rgba(54, 162, 235, 0.2)',
//               'rgba(255, 206, 86, 0.2)',
//               'rgba(75, 192, 192, 0.2)',
//               'rgba(153, 102, 255, 0.2)',
//               'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//               'rgba(255,99,132,1)',
//               'rgba(54, 162, 235, 1)',
//               'rgba(255, 206, 86, 1)',
//               'rgba(75, 192, 192, 1)',
//               'rgba(153, 102, 255, 1)',
//               'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//           }
//         ]
//       },
//       options: {
//         scales: {}
//       }
//     });
//   }

//   render() {
//     return html` <base-chart
//       .data=${{
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//         datasets: [
//           {
//             label: 'My First dataset',
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [0, 10, 5, 2, 20, 30, 45]
//           }
//         ]
//       }}
//       type="line"
//     ></base-chart>`;
//   }
// }
