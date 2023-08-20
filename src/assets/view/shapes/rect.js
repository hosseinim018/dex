import {Point} from "@/assets/chart/shapes/point";

export class Rect{
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.fillColor = 'rgba(241,18,230,0.36)';
        this.dragEnabled = false;

        // init points
        this.topLeft = new Point(0, 0);
        this.topRight = new Point(0, 0);
        this.bottomRight = new Point(0, 0);
        this.bottomLeft = new Point(0, 0);

        this.points = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];

        const allX = this.points.map(p => p.x);
        const allY = this.points.map(p => p.y);

        this.minX = Math.min(...allX);
        this.minY = Math.min(...allY);
        this.maxX = Math.max(...allX);
        this.maxY = Math.max(...allY);

        this._x = this.minX;
        this._y = this.minY;
        this._width = this.maxX - this.minX;
        this._height = this.maxY - this.minY;

        this.topLeft.set(this.minX, this.minY);
        this.topRight.set(this.maxX, this.minY);
        this.bottomRight.set(this.maxX, this.maxY);
        this.bottomLeft.set(this.minX, this.maxY);
    }
    mousedown(e) {
        const pointPressed = this.points.find(point => point.containsXY(mouseX, mouseY));

        if (pointPressed) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
            return true;
        } else {
            const dragAreaPressed = this.dragArea.containsXY(mouseX, mouseY);
            if (dragAreaPressed) {
                this.isDragged = true;
                this.dragOffset = new Point(mouseX - this.x, mouseY - this.y);
                return true;
            }
        }
        return false;
    }

    mousemove(e) {
        const pointDragged = this.points.find(point => point.isBeingDragged);

        if (pointDragged) {
            pointDragged.set(mouseX, mouseY);

            if (this.topLeft == pointDragged) {
                this.bottomLeft.x = pointDragged.x;
                this.topRight.y = pointDragged.y;

            } else if (this.topRight == pointDragged) {
                this.bottomRight.x = pointDragged.x;
                this.topLeft.y = pointDragged.y;

            } else if (this.bottomRight == pointDragged) {
                this.topRight.x = pointDragged.x;
                this.bottomLeft.y = pointDragged.y;

            } else if (this.bottomLeft == pointDragged) {
                this.topLeft.x = pointDragged.x;
                this.bottomRight.y = pointDragged.y;
            }
            this.computePosAndSize();
        } else {
            this._x = mouseX - this.dragOffset.x;
            this._y = mouseY - this.dragOffset.y;
            this.computePoints();
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
        cnx.fillRect(this.x, this.y, this.width, this.height)

        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }
    }

}