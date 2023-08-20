import * as d3 from "d3";

export function crosshair(x, y, cnxYaxis, cnxXaxis, xscale, yscale, margin) {
    cnxXaxis.save()
    cnxYaxis.save()
    // a rect on yaxis
    cnxYaxis.beginPath()
    cnxYaxis.fillStyle = 'black'
    cnxYaxis.fillRect(0, y - 10, margin.right, 20)
    cnxYaxis.fillStyle = 'white'
    cnxYaxis.font = "12px serif"
    const f = d3.format(".10f");
    cnxYaxis.fillText(f(yscale.invert(y)), 4, y + 5)
    // a rect on xaxis
    cnxXaxis.beginPath()
    cnxXaxis.fillStyle = 'black'
    cnxXaxis.fillRect(x - 50, 0, 100, 20)
    cnxXaxis.fillStyle = 'white'
    cnxXaxis.font = "12px serif"
    let parseDate = d3.timeFormat("%d  %b'%y %I:%M");
    cnxXaxis.fillText(parseDate(xscale.invert(x)), x - 40, 15)

    cnxXaxis.restore()
    cnxYaxis.restore()
}


// crosshair
// function crosshair(x, y, xscale, yscale) {
//   cnxXaxis.save()
//   cnxYaxis.save()
//   // a rect on yaxis
//   cnxYaxis.beginPath()
//   cnxYaxis.fillStyle = 'black'
//   cnxYaxis.fillRect(0, y - 10, 50, 20)
//   cnxYaxis.fillStyle = 'white'
//   cnxYaxis.font = "12px serif"
//   const f = d3.format(".1f");
//   cnxYaxis.fillText(f(yscale.invert(y)), 4, y + 5)
//   // a rect on xaxis
//   cnxXaxis.beginPath()
//   cnxXaxis.fillStyle = 'black'
//   cnxXaxis.fillRect(x - 50, 0, 100, 20)
//   cnxXaxis.fillStyle = 'white'
//   cnxXaxis.font = "12px serif"
//   let parseDate = d3.timeFormat("%d  %b'%y %I:%M");
//   cnxXaxis.fillText(parseDate(xscale.invert(x)), x - 40, 15)
//
//   cnxXaxis.restore()
//   cnxYaxis.restore()
// }
