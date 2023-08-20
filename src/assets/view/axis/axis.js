import * as d3 from "d3";

export function Yaxis(cnx, cnxYaxis, scale, width) {
    scale.ticks().forEach(y => {
        cnx.beginPath()
        cnx.moveTo(0, scale(y))
        cnx.lineTo(width, scale(y));
        cnx.lineWidth = 1
        cnx.setLineDash([])
        cnx.strokeStyle = '#F2F3F3';
        // F2F3F3
        // #dfdfdf
        cnx.stroke();
        // tick Lable
        cnxYaxis.beginPath()
        cnxYaxis.fillStyle = 'black'
        cnxYaxis.font = "12px serif"
        // const f = d3.format(",.3f")
        const f = (num) => {
            if (num >= 1e6) {
                return '$' + (num / 1e6).toFixed(2) + 'M'
            }
            if (num >= 1e3) {
                return '$' + (num / 1e3).toFixed(2) + 'K'
            }
        }
        cnxYaxis.fillText(y, 5, scale(y))
        cnxYaxis.closePath()
    })
}

export function Xaxis(cnx, cnxXaxis, scale, height) {
    scale.ticks(6).forEach(x => {
        cnx.beginPath()
        cnx.moveTo(scale(x), 0)
        cnx.lineTo(scale(x), height);
        cnx.lineWidth = 1
        cnx.setLineDash([])
        cnx.strokeStyle = '#F2F3F3';
        cnx.stroke();
        // Lable
        cnxXaxis.beginPath()
        cnxXaxis.font = "12px serif"
        // let parseDate = d3.timeFormat("%d  %b'%y %I:%M");
        let parseDate = scale.tickFormat();
        cnxXaxis.fillText(parseDate(x), scale(x) - 40, 15)
    })
}


export function grid(cnx, cnxYaxis, cnxXaxis, xscale, yscale, height, width) {
    Yaxis(cnx, cnxYaxis, yscale, width)
    Xaxis(cnx, cnxXaxis, xscale, height)
}