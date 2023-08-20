import {calPoint} from "@/assets/chart/shapes/math";
import {Point} from "@/assets/chart/shapes/point";
import {regression} from "@/assets/chart/indicator/math";

export class verticalLine{
    constructor(x, canvas) {
        this.x = x
        this.dragEnabled = false;

        let cnx = canvas.getContext('2d')
        let rect = canvas.getBoundingClientRect()

        this.point = new Point(this.x, rect.height/2)
        this.points = [this.point]
    }

    mousedown(e) {
        let p = calPoint(e)
        const pointPressed = this.points.find(point => point.inPoint(p.x, p.y));
        if (pointPressed) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
        }
    }

    mousemove(e) {
        let p = calPoint(e)
        const pointDragged = this.points.find(point => point.isBeingDragged);
        if (pointDragged) {
            if (this.point == pointDragged) {
                this.x = p.x
                this.point.x = p.x;
            }
        }
    }

    mouseup(e) {
        this.points.forEach(p => {
            p.isBeingDragged = false;
        });
        this.isDragged = false;
    }

    draw(canvas){
        let cnx = canvas.getContext('2d')
        let rect = canvas.getBoundingClientRect()
        cnx.beginPath()
        cnx.strokeStyle = 'rgba(241,18,96,0.36)'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(this.x, 0)
        cnx.lineTo(this.x, rect.height)
        cnx.stroke();

        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }
    }

}

export class horizontalLine{
    constructor(y, canvas) {
        this.y = y
        this.dragEnabled = false;

        let cnx = canvas.getContext('2d')
        let rect = canvas.getBoundingClientRect()

        this.point = new Point(rect.width/2, this.y)
        this.points = [this.point]
    }
    mousedown(e) {
        let p = calPoint(e)
        const pointPressed = this.points.find(point => point.inPoint(p.x, p.y));
        if (pointPressed) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
        }
    }

    mousemove(e) {
        let p = calPoint(e)
        const pointDragged = this.points.find(point => point.isBeingDragged);
        if (pointDragged) {
            if (this.point == pointDragged) {
                this.y = p.y
                this.point.y = p.y;
            }
        }
    }
    mouseup(e) {
        this.points.forEach(p => {
            p.isBeingDragged = false;
        });
        this.isDragged = false;
    }

    draw(canvas){
        let cnx = canvas.getContext('2d')
        let rect = canvas.getBoundingClientRect()
        cnx.beginPath()
        cnx.strokeStyle = 'rgba(241,18,96,0.36)'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(0, this.y)
        cnx.lineTo(rect.width, this.y)
        cnx.stroke();

        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }
    }
}

export class crossLine{
    constructor(x, y, canvas) {
        this.x = x
        this.y = y

        let cnx = canvas.getContext('2d')
        let rect = canvas.getBoundingClientRect()

        this.point = new Point(this.x, this.y)
        this.points = [this.point]

        this.dragEnabled = false;
    }

    mousedown(e){
        let p = calPoint(e)
        const pointPressed = this.points.find(point => point.inPoint(p.x, p.y));
        if (pointPressed) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
        }
    }

    mousemove(e){
        let p = calPoint(e)
        const pointDragged = this.points.find(point => point.isBeingDragged);
        if (pointDragged) {
            if (this.point == pointDragged) {
                this.x = p.x
                this.y = p.y
                this.point.x = p.x;
                this.point.y = p.y
            }
        }
    }

    mouseup(e){
        this.points.forEach(p => {
            p.isBeingDragged = false;
        });
        this.isDragged = false;
    }

    draw(canvas){
        let cnx = canvas.getContext('2d')
        let rect = canvas.getBoundingClientRect()

        cnx.beginPath()
        cnx.strokeStyle = 'rgba(241,18,96,0.36)'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(this.x, 0)
        cnx.lineTo(this.x, rect.height)
        cnx.stroke();

        cnx.beginPath()
        cnx.strokeStyle = 'rgba(241,18,96,0.36)'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(0, this.y)
        cnx.lineTo(rect.width, this.y)
        cnx.stroke();

        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }
    }

}

export class trendline{
    constructor(x1, x2, y1, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1
        this.y2 = y2;
        this.dragEnabled = false;

        // init points
        this.p1 = new Point(this.x1, this.y1)
        this.p2 = new Point(this.x2, this.y2)
        this.points = [this.p1, this.p2]
    }

    mousedown(e) {
        let p = calPoint(e)
        const pointPressed = this.points.find(point => point.inPoint(p.x, p.y));

        if (pointPressed) {
            pointPressed.isBeingDragged = true;
            this.isDragged = true;
        }
    }

    mousemove(e){
        let p = calPoint(e)
        const pointDragged = this.points.find(point => point.isBeingDragged);

        if (pointDragged) {
            if (this.p1 == pointDragged) {
                this.x1 = p.x
                this.y1 = p.y
                this.p1.x = p.x
                this.p1.y = p.y
            } else if (this.p2 == pointDragged) {
                // pointDragged.set(p.x, p.y);
                this.x2 = p.x
                this.y2 = p.y
                this.p2.x = p.x
                this.p2.y = p.y
            }
        }
    }

    mouseup(e){
        this.points.forEach(p => {
            p.isBeingDragged = false;
        });
        this.isDragged = false;
    }

    draw(canvas){
        let cnx = canvas.getContext('2d')
        let rect = canvas.getBoundingClientRect()
        cnx.beginPath()
        cnx.strokeStyle = '#002aff'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(this.x1, this.y1)
        cnx.lineTo(this.x2, this.y2);
        cnx.stroke();

        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }

    }
}

export class reyLine extends trendline{
    constructor(x1, x2, y1, y2) {
        super(x1, x2, y1, y2)
    }
    draw(canvas) {
        let cnx = canvas.getContext('2d')
        let rect = canvas.getBoundingClientRect()
        const y = regression(0, [this.x1, this.y1], [this.x2, this.y2])
        const y2 = regression(rect.width, [this.x1, this.y1], [this.x2, this.y2])

        cnx.beginPath()
        cnx.strokeStyle = '#002aff'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(0, y)
        cnx.lineTo(rect.width, y2);
        cnx.stroke();

        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }
    }
}

export class xreyLine extends reyLine{
    constructor(x1, x2, y1, y2) {
        super(x1, x2, y1, y2);
    }
    draw(canvas) {
        let cnx = canvas.getContext('2d')
        let rect = canvas.getBoundingClientRect()
        const y = regression(0, [this.x1, this.y1], [this.x2, this.y2])
        const y2 = regression(rect.width, [this.x1, this.y1], [this.x2, this.y2])

        cnx.beginPath()
        cnx.strokeStyle = '#002aff'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(this.x1, this.y1)
        cnx.lineTo(rect.width, y2);
        cnx.stroke();

        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }
    }
}