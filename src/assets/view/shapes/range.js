import {trendline} from "@/assets/chart/shapes/lines";

export class Range extends trendline{
    constructor(x1, x2, y1, y2) {
        super(x1, x2, y1, y2);
    }

    draw(canvas) {
        let cnx = canvas.getContext('2d')
        cnx.beginPath()
        cnx.fillStyle = (this.y1 === this.y2) ? "silver" : (this.y1 < this.y2) ? "rgba(239,83,80,0.3)" : "rgba(38,166,154,0.3)"
        cnx.fillRect(this.x1, (this.y1 < this.y2) ? this.y1 : this.y2, Math.abs(this.x2-this.x1), Math.abs(this.y2-this.y1))

        cnx.beginPath()
        cnx.fillStyle = 'black'
        cnx.font = "12px serif"
        const text = `p1:${this.y1}-p2:${this.y2}-prcent:${Math.abs(this.y2-this.y1)/100}`
        cnx.fillText(text, this.x1, this.y1)

        if (this.dragEnabled) {
            this.points.forEach(point => {
                point.draw(canvas)
            });
        }
    }
}