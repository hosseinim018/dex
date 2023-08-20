import * as d3 from "d3";

export function Lable(cnx, cnxYaxis, yscale, width, margin, lastData, color) {
    // line on canvas
    Lable.line = (i=4) => {
        cnx.beginPath()
        cnx.lineWidth = 1
        cnx.setLineDash([2, 2])
        cnx.strokeStyle = color ? color : ((lastData[1] === lastData[4]) ? "silver" : (lastData[1] > lastData[4]) ? "#EF5350" : "#26A69A");
        cnx.moveTo(0, yscale(lastData[i]))
        cnx.lineTo(width, yscale(lastData[i]));
        cnx.stroke();
    }
    // rect on yaxis
    Lable.lable = (i=4) => {
        cnxYaxis.beginPath()
        cnxYaxis.fillStyle = color ? color : ((lastData[1] === lastData[4]) ? "silver" : (lastData[1] > lastData[4]) ? "#EF5350" : "#26A69A");
        //now width cnxYaxis set to 50 in future should change
        cnxYaxis.fillRect(0, yscale(lastData[i]) - 10, margin.right, 20)
        cnxYaxis.fillStyle = 'white'
        cnxYaxis.font = "12px serif"
        const f = d3.format(".1f");
        cnxYaxis.fillText(f(lastData[i]), 4, yscale(lastData[i]) + 5)
    }
    return Lable
}