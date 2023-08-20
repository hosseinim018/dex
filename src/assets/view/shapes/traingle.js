import {Point} from "@/assets/chart/shapes/point";
import {calPoint} from "@/assets/chart/shapes/math";

export class Triangle {
  constructor (x1, y1, x2, y2, x3, y3){
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
    this.p3 = new Point(x3, y3);

    this.dragEnabled = false;
    this.isDragged = false;

    this.points = [this.p1, this.p2, this.p3];

    this.fillColor = 'rgba(241,18,230,0.36)';
  }

  mousedown(e){
    let p = calPoint(e)
    const pointPressed = this.points.find(point => point.inPoint(p.x, p.y));

    if (pointPressed){
      pointPressed.isBeingDragged = true;
      this.isDragged = true;
      return true;
    }
    return false;
  }

  mousemove(e){
    let p = calPoint(e)
    const pointDragged = this.points.find(point => point.isBeingDragged);

    if (pointDragged) {
      pointDragged.set(p.x, p.y);
    }
  }

  mouseup(e){
    this.points.forEach(point => { point.isBeingDragged = false; });
    this.isDragged = false;
  }

  draw(canvas){
    let cnx = canvas.getContext('2d')
    cnx.beginPath()
    cnx.fillStyle = this.fillColor
    cnx.moveTo(this.p1.x, this.p1.y)
    cnx.lineTo(this.p2.x, this.p2.y)
    cnx.lineTo(this.p3.x, this.p3.y)
    cnx.closePath()
    cnx.fill()

    if (this.dragEnabled) {
      this.points.forEach(point => {point.draw(canvas)});
    }
  }
}