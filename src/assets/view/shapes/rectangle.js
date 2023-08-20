import {Point} from "@/assets/chart/shapes/point";
import {calPoint} from "@/assets/chart/shapes/math";

class Rect {
  constructor(x, y, p_nWidth, p_nHeight){
    this._x = x;
    this._y = y;
    this._width = p_nWidth;
    this._height = p_nHeight;
  }

  get x(){ return this._x; }
  get y(){ return this._y; }
  get width(){ return this._width; }
  get height(){ return this._height; }
  get minX(){ return this._x; }
  get minY(){ return this._y; }
  get maxX(){ return this._x + this._width; }
  get maxY(){ return this._y + this._height; }
  get centerX(){ return this._x + this._width / 2; }
  get centerY(){ return this._y + this._height / 2; }

  move(x, y){
    this._x += x;
    this._y += y;
  }

  copy(){
    return new Rect(this._x, this._y, this._width, this._height);
  }

  localRect(){
    return new Rect(0, 0, this.width, this.height);
  }

  contains(otherRect){
    return this.minX < otherRect.minX && this.maxX > otherRect.maxX
            && this.minY < otherRect.minY && this.maxY > otherRect.maxY;
  }

  expandToIncludeRect(otherRect){
    let maxX = this.maxX;
    let maxY = this.maxY;

    this._x = Math.min(this._x, otherRect._x);
    this._y = Math.min(this._y, otherRect._y);

    maxX = Math.max(maxX, otherRect.maxX);
    maxY = Math.max(maxY, otherRect.maxY);

    this._width  = maxX - this._x;
    this._height = maxY - this._y;
  }

  inPoint(x, y){
    return this.minX <= x && x < this.maxX
           && this.minY <= y && y < this.maxY;
  }

  getConcentric(scale){
    let newX = this.x - (scale - 1) * this.width / 2;
    let newY = this.y - (scale - 1) * this.height / 2;
    return new Rect(newX, newY, this.width * scale, this.height * scale);
  }
}


export class Rectangle extends Rect{
    constructor(x, y, p_nWidth, p_nHeight) {
        super(x, y, p_nWidth, p_nHeight);
        this.initPoints();
        this.computePoints();
        this.dragEnabled = false;
        this.dragArea = this;
        this.dragOffset = undefined;
        this.isDragged = false;
        this.fillColor = 'rgba(241,18,230,0.36)';
    }

    setSize(newSize) {
        let deltaWidth = this.width - newSize;
        let deltaHeight = this.height - newSize;

        // Maintain location
        this._x += deltaWidth / 2;
        this._y += deltaHeight / 2;

        this._width = newSize;
        this._height = newSize;
    }

    initPoints() {
        this.topLeft = new Point(0, 0);
        this.topRight = new Point(0, 0);
        this.bottomRight = new Point(0, 0);
        this.bottomLeft = new Point(0, 0);

        this.points = [];
        this.points.push(this.topLeft);
        this.points.push(this.topRight);
        this.points.push(this.bottomRight);
        this.points.push(this.bottomLeft);
    }

    computePoints() {
        this.topLeft.set(this.minX, this.minY);
        this.topRight.set(this.maxX, this.minY);
        this.bottomRight.set(this.maxX, this.maxY);
        this.bottomLeft.set(this.minX, this.maxY);
    }

    computePosAndSize() {
        const allX = this.points.map(p => p.x);
        const allY = this.points.map(p => p.y);

        const minX = Math.min(...allX);
        const minY = Math.min(...allY);
        const maxX = Math.max(...allX);
        const maxY = Math.max(...allY);

        this._x = minX;
        this._y = minY;
        this._width = maxX - minX;
        this._height = maxY - minY;
    }

    mousedown(e) {
        let p = calPoint(e)
        const pointPressed = this.points.find(point => point.inPoint(p.x, p.y));

        if (pointPressed) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
            return true;
        } else {
            const dragAreaPressed = this.dragArea.inPoint(p.x, p.y);
            if (dragAreaPressed) {
                this.isDragged = true;
                this.dragOffset = new Point(p.x - this.x, p.y - this.y);
                return true;
            }
        }
        return false;
    }

    mousemove(e) {
        let p = calPoint(e)
        const pointDragged = this.points.find(point => point.isBeingDragged);

        if (pointDragged) {
            pointDragged.set(p.x, p.y);

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
            this._x = p.x - this.dragOffset.x;
            this._y = p.y - this.dragOffset.y;
            this.computePoints();
        }
    }

    mouseup(e) {
        this.points.forEach(point => {
            point.isBeingDragged = false;
        });
        this.isDragged = false;
    }

    draw(canvas) {
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