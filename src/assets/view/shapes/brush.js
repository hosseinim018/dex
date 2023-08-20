import {calPoint} from "@/assets/chart/shapes/math";
import {Point} from "@/assets/chart/shapes/point";

export class Brush{
    dragEnabled = false
    points = []
    fillColor = 'rgba(241,18,96,0.36)'
    size = 2
    constructor() {
        this.isDragged = false
    }
    mousedown(e){
        this.isDragged = true
        let p = calPoint(e)
        let point = new Point(p.x, p.y)
        this.points = [point]

    }
    mousemove(e){
        if (this.isDragged){
            let p = calPoint(e)
            let point = new Point(p.x, p.y)
            this.points.push(point)
        }
    }
    mouseup(e){
        this.dragEnabled = false
        this.isDragged = false;
    }

    draw(canvas){
        let cnx = canvas.getContext('2d')
        cnx.beginPath()
        cnx.strokeStyle = this.fillColor
        cnx.lineWidth = this.size
        cnx.setLineDash([])
        this.points.forEach(point => {
            cnx.lineTo(point.x, point.y)
        })
        cnx.stroke();
    }
}