import {sma, ema, wma} from "@/assets/chart/indicator/math";

export const chart = {
    candles(cnx, data, xb, xscale, yscale) {
        data.forEach(d => {
            cnx.beginPath()
            cnx.fillStyle = (d[1] === d[4]) ? "silver" : (d[1] > d[4]) ? "#EF5350" : "#26A69A"
            cnx.fillRect(xscale(d[0]) - xb.bandwidth() / 2,
                yscale(Math.max(d[1], d[4])),
                xb.bandwidth(),
                (d[1] === d[4]) ? 1 : yscale(Math.min(d[1], d[4])) - yscale(Math.max(d[1], d[4])))
            cnx.beginPath()
            cnx.strokeStyle = (d[1] === d[4]) ? "silver" : (d[1] > d[4]) ? "#EF5350" : "#26A69A";
            cnx.lineWidth = 1
            cnx.setLineDash([])
            cnx.moveTo(xscale(d[0]), yscale(d[2]))
            cnx.lineTo(xscale(d[0]), yscale(d[3]));
            cnx.stroke();
            // cnx.closePath()
        });
    },
}

export class Bar {
    constructor(data) {
        this.fillColor = "#69b3a2"
    }
    call(){

    }
    // Add the bars to the chart
// svg.selectAll('.bar')
//     .data(data)
//     .enter().append('rect')
//     .attr('class', 'bar')
//     .attr('x', (d, i) => x(i))
//     .attr('y', (d) => y(d))
//     .attr('width', x.bandwidth())
//     .attr('height', (d) => height - y(d));
    draw(canvas, xscale, yscale, width, height){
        let cnx = canvas.getContext('2d')
        cnx.beginPath()
        cnx.fillStyle = this.fillColor
        cnx.fillRect(xscale, yscale, width, height)
        // cnx.fillRect(xscale(d[0]) - xb.bandwidth() / 2,
        //     yscale(Math.max(d[1], d[4])), xb.bandwidth(),
        //     (d[1] === d[4]) ? 1 : yscale(Math.min(d[1], d[4])) - yscale(Math.max(d[1],
        //         d[4])))

    }
}

export class Candelstick {
    constructor(data) {
        this.data = data
        this.Bars = new Bar(data)
    }
    call(){}
    draw(canvas, xscale, yscale){
        let cnx = canvas.getContext('2d')
        this.data.forEach(d => {
            this.Bars.fillColor = (d[1] === d[4]) ? "silver" : (d[1] > d[4]) ? "#EF5350" : "#26A69A"

            this.Bars.draw(canvas, xscale(d[0]) - xscale.bandwidth() / 2,
                yscale(Math.max(d[1], d[4])), xscale.bandwidth(),
                (d[1] === d[4]) ? 1 : yscale(Math.min(d[1], d[4])) - yscale(Math.max(d[1], d[4]))
                )

            cnx.beginPath()
            cnx.strokeStyle = (d[1] === d[4]) ? "silver" : (d[1] > d[4]) ? "#EF5350" : "#26A69A";
            cnx.lineWidth = 1
            cnx.setLineDash([])
            cnx.moveTo(xscale(d[0]), yscale(d[2]))
            cnx.lineTo(xscale(d[0]), yscale(d[3]));
        });
        cnx.stroke();
    }
}

export class lineChart {
    constructor(data) {

        this.fillColor = "#69b3a2"
        this.lineWidth = 1
        this.basedOn = 'close'
        this.LineDash = [0, 0]

        this.newFrame = {}
        this.newFrame['open_time'] = data.map(d => d[0])
        this.newFrame['open'] = data.map(d => +d[1])
        this.newFrame['high'] = data.map(d => +d[2])
        this.newFrame['low'] = data.map(d => +d[3])
        this.newFrame['close'] = data.map(d => +d[4])
        this.newFrame['volume'] = data.map(d => +d[5])
        this.newFrame['close_time'] = data.map(d => +d[6])

    }

    call() {

        this.dataframe = {}
        this.dataframe['open_time'] = this.newFrame['open_time']
        this.dataframe[this.basedOn] = this.newFrame[this.basedOn]

    }

    draw(canvas, xscale, yscale) {

        let cnx = canvas.getContext('2d')
        cnx.beginPath()
        cnx.strokeStyle = this.fillColor
        cnx.lineWidth = this.lineWidth
        cnx.setLineDash(this.LineDash)
        let val = true
        let prev, prevd = 0

        for (let i = 0; i < this.dataframe[this.basedOn].length; i++) {
            let d = Object.keys(this.dataframe).map(key => this.dataframe[key][i])

            if (val) {
                prev = d[1]
                prevd = d[0]
                val = false
            }

            cnx.moveTo(xscale(prevd), yscale(prev))
            cnx.lineTo(xscale(d[0]), yscale(d[1]));
            prev = d[1]
            prevd = d[0]

        }
        cnx.stroke();
    }
}
export class smaLine extends lineChart {
    constructor(data) {
        super(data);
    }

    call(p) {
        super.call();
        this.dataframe = {}
        this.dataframe['open_time'] = this.newFrame['open_time']
        // this.dataframe[this.basedOn] = this.newFrame[this.basedOn]
        this.dataframe[this.basedOn] = sma(this.newFrame[this.basedOn], p)
    }
    draw(canvas, xscale, yscale){
        super.draw(canvas, xscale, yscale);
    }
}
export class emaLine extends lineChart {
    constructor(data) {
        super(data);
    }

    call(p) {
        super.call();
        this.dataframe = {}
        this.dataframe['open_time'] = this.newFrame['open_time']
        // this.dataframe[this.basedOn] = this.newFrame[this.basedOn]
        this.dataframe[this.basedOn] = ema(this.newFrame[this.basedOn], p)
    }
    draw(canvas, xscale, yscale){
        super.draw(canvas, xscale, yscale);
    }
}
export class wmaLine extends lineChart {
    constructor(data) {
        super(data);
    }

    call(p) {
        super.call();
        this.dataframe = {}
        this.dataframe['open_time'] = this.newFrame['open_time']
        // this.dataframe[this.basedOn] = this.newFrame[this.basedOn]
        this.dataframe[this.basedOn] = wma(this.newFrame[this.basedOn], p)
    }
    draw(canvas, xscale, yscale){
        super.draw(canvas, xscale, yscale);
    }
}

export const Charts = {
    Line: lineChart,
    Candelstick: Candelstick,
    Sma: smaLine,
    Ema: emaLine,
    Wma: wmaLine,
}
