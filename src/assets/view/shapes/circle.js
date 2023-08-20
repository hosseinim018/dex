import {Point} from "@/assets/chart/shapes/point";
import {calPoint, createVector, dist} from "@/assets/chart/shapes/math";

export class Circle{
  constructor(x, y, radius) {
    this.x = x
    this.y = y
    this.radius = radius
    this.dragEnabled = false;
    this.fillColor = 'rgba(241,18,230,0.36)';
    // initilize points:
    this.initPoints()
  }
  initPoints(){
    this.centerPoint = new Point(this.x, this.y)
    this.rediusPoint = new Point(this.x + this.radius, this.y)
    this.points = [this.centerPoint, this.rediusPoint]
  }

  mousedown(e){
    let p = calPoint(e)
    const pointPressed = this.points.find(point => point.inPoint(p.x, p.y));

    if (pointPressed){
      pointPressed.isBeingDragged = true;
      this.isDragged = true;
    }
  }
  mousemove(e){
    let p = calPoint(e)
    const pointDragged = this.points.find(point => point.isBeingDragged);

    if (pointDragged) {
      if (this.rediusPoint == pointDragged) {
        let dx = Math.abs(p.x-this.x)**2
        this.radius = Math.sqrt(dx)
        pointDragged.x = p.x;
      } else if (this.centerPoint == pointDragged) {
        pointDragged.set(p.x, p.y);
        this.x = p.x
        this.y = p.y
        this.rediusPoint.y = pointDragged.y;
        this.rediusPoint.x = pointDragged.x + this.radius;
      }
    }
  }

  mouseup(e){
    this.points.forEach(p => {
      p.isBeingDragged = false;
    });
    this.isDragged = false;
  }

  draw(canvas) {
    let cnx = canvas.getContext('2d')
    cnx.beginPath()
    cnx.fillStyle = this.fillColor
    cnx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    cnx.fill()

    if (this.dragEnabled) {
      this.points.forEach(point => {point.draw(canvas)});
    }
  }
}

