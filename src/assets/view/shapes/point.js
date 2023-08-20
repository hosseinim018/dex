// point is circle for handle drag
import {calPoint, dist} from "@/assets/chart/shapes/math";

export class Point{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.redius = 5
        this.dragEnabled = false;
        this.isBeingDragged = false;
    }
    set(x, y){
        this.x = x
        this.y = y
    }
    inPoint(mouseX, mouseY){
        // is locaiton on/in circle(point)?  return true or false
        return dist(mouseX, mouseY, this.x, this.y) <= this.redius
    }
    mousedown(e){
        let p = calPoint(e)
        this.isDragged = this.inPoint(p.x, p.y);
        return this.isDragged;
    }
    mousemove(e){
        if (this.isDragged) {
            let p = calPoint(e)
            this.x = p.x
            this.y = p.y
        }
    }
    mouseup(e){
        this.isDragged = false;
    }
    draw(canvas){
        let cnx = canvas.getContext('2d')
        cnx.beginPath()
        cnx.fillStyle = '#ff5c00'
        cnx.arc(this.x, this.y, this.redius, 0, 2 * Math.PI)
        cnx.fill()
    }
}