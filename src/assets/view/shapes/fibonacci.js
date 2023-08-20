import {trendline} from "@/assets/chart/shapes/lines";
import {FibonacciRetracement} from "@/assets/chart/indicator/math";

export class fibonacciRetracement extends trendline{
    constructor(x1, x2, y1, y2) {
        super(x1, x2, y1, y2)
    }
    draw(canvas){
        let cnx = canvas.getContext('2d')
        const fib = FibonacciRetracement(this.y1, this.y2)
        for (const fibKey in fib) {
            cnx.beginPath()
            cnx.strokeStyle = '#ff00aa'
            cnx.lineWidth = 1.5
            cnx.setLineDash([])
            cnx.moveTo(this.x1, fib[fibKey])
            cnx.lineTo(this.x2, fib[fibKey]);
            cnx.stroke();

            cnx.beginPath()
            cnx.fillStyle = 'black'
            cnx.font = "12px serif"
            cnx.fillText(`${fibKey} (${fib[fibKey]})`, this.x1, fib[fibKey])
        }
        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }
    }
}