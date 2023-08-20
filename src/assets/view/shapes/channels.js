import {Point} from "@/assets/chart/shapes/point";
import {calPoint} from "@/assets/chart/shapes/math";

export class Channel {
    constructor(x, y,x2 , width, height) {
        this.dx = Math.abs(x-x2)
        this.topLeft = new Point(x, y)
        this.topRight = new Point(width, y)
        this.bottomRight = new Point(width - this.dx, height)
        this.bottomLeft = new Point(x2, height)
        this.points = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft]
        this.dragEnabled = false
        this.fillColor = 'rgba(241,18,230,0.36)';
    }
    inPoint(x, y) {
        const allX = this.points.map(p => p.x);
        const allY = this.points.map(p => p.y);
        const minX = Math.min(...allX);
        const minY = Math.min(...allY);
        const maxX = Math.max(...allX);
        const maxY = Math.max(...allY);

        return minX <= x && x < maxX
            && minY <= y && y < maxY;
    }

    mousedown(e) {
        let p = calPoint(e)
        const pointPressed = this.points.find(point => point.inPoint(p.x, p.y));

        if (pointPressed) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
            return true;
        } else {
            const dragAreaPressed = this.inPoint(p.x, p.y);
            if (dragAreaPressed) {
                this.isDragged = true;
                return true;
            }
            return false;
        }
    }

    mousemove(e) {
        let p = calPoint(e)
        const pointDragged = this.points.find(point => point.isBeingDragged);
        const dragAreaPressed = this.inPoint(p.x, p.y);
        if (pointDragged) {
            pointDragged.set(p.x, p.y);
            if (this.topLeft == pointDragged) {
                this.bottomLeft.x = pointDragged.x - this.dx;
                this.topRight.y = pointDragged.y;

            } else if (this.topRight == pointDragged) {
                this.bottomRight.x = pointDragged.x - this.dx;
                this.topLeft.y = pointDragged.y;

            } else if (this.bottomRight == pointDragged) {
                this.topRight.x = pointDragged.x + this.dx;
                this.bottomLeft.y = pointDragged.y;

            } else if (this.bottomLeft == pointDragged) {
                this.topLeft.x = pointDragged.x + this.dx;
                this.bottomRight.y = pointDragged.y;
            }
        }
        if (dragAreaPressed){
            // this.points.forEach((point, index) => {
            // });
        }
    }

    mouseup(e) {
        this.points.forEach(point => {
            point.isBeingDragged = false;
        });
        this.isDragged = false;
    }

    draw(canvas){
        let cnx = canvas.getContext('2d')
        cnx.beginPath()
        cnx.fillStyle = this.fillColor

        this.points.forEach((point, index) => {
            if (index == 0){
                cnx.moveTo(point.x, point.y)
            }else {
                cnx.lineTo(point.x, point.y)
            }
        });

        cnx.closePath()
        cnx.fill()

        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }
    }
}
