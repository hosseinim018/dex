import {FibonacciRetracement, regression} from "@/assets/chart/indicator/math";
import * as d3 from "d3";

// pointer is a circle when mouse drag on it can resize location shapes
// circle formula : c(o, r): (x-a)^2+(y-b)^2=r^2
// o(a, b)
// a(x, y) ==> if c(a)<=0 ==> mouse on/in circle

// is locaiton on/in circle and return true or false
function onPointer(x, y, a, b, r){
    // circle formula :: c(o, r): (x-a)^2+(y-b)^2=r^2
    // o(a, b) ==> coorinates of the center of the circle
    // let c = Math.abs(x-a)**2 + Math.abs(y-b)**2
    let c = (x-a)**2 + (y-b)**2
    if (Math.sqrt(c) <= r){
        return true
    }else {
        return false
    }
}

export function circle(canvas, draw, xscale, yscale){
    let cnx = canvas.getContext('2d')

    let r = 0,
    points = [];

    function Circle(x, y, r) {
        cnx.beginPath()
        cnx.fillStyle = 'rgba(241,18,230,0.36)'
        cnx.arc(x, y, r, 0, 2 * Math.PI)
        cnx.fill()
    }
    // handle drag event
    let rect = canvas.getBoundingClientRect()
    let drag = false,
        drawPoint1 = true,
        drawPoint2 = false,
        index = 0;
    canvas.addEventListener('mousedown', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint1) {
            points = [
                [Px, Py],
            ]
            cnx.beginPath()
            cnx.fillStyle = '#ff5c00'
            cnx.arc(points[0][0], points[0][1], 5, 0, 2 * Math.PI)
            cnx.fill()
            drawPoint1 = false
            drawPoint2 = true
        } else {
            points.forEach((point, i)=> {
                if (onPointer(Px, Py, point[0], point[1], 5)) {
                    drag = true
                    index = i
                    canvas.className = canvas.classList[0] + ' cursor-grab'
                }
            })
        }
    })
    canvas.addEventListener('mousemove', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint2) {
            points = [
                [points[0][0], points[0][1]],
                [Px, Py],
            ]
            r = Math.abs(Px-points[0][0])
            cnx.clearRect(0, 0, 1000, 1000)
            draw(xscale, yscale, e)
            Circle(points[0][0], points[0][1], r)
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
        } else {
            if (drag){
                cnx.clearRect(0, 0, 1000, 1000)
                draw(xscale, yscale, e)
                if (index == 0){
                    Circle(Px, Py, r)
                    points = [
                        [Px, Py],
                        [Px+r, Py],
                    ]
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                if (index == 1){
                    points = [
                        [points[0][0], points[0][1]],
                        [Px, Py],
                    ]
                    r = Math.abs(Px-points[0][0])
                    Circle(points[0][0], points[0][1], r)
                    cnx.beginPath()
                    cnx.fillStyle = '#ff5c00'
                    cnx.arc(points[0][0], points[0][1], 5, 0, 2 * Math.PI)
                    cnx.fill()
                    cnx.beginPath()
                    cnx.fillStyle = '#ff5c00'
                    cnx.arc(Px, Py, 5, 0, 2 * Math.PI)
                    cnx.fill()
                }
                canvas.className = canvas.classList[0] +' cursor-grabbing'
            }
        }
    })
    canvas.addEventListener('mouseup', (e)=>{
        drawPoint2 = false
        console.log(drawPoint1, drawPoint2)
        drag = false
        canvas.className = canvas.classList[0] +' cursor-crosshair'
        // console.log(points, r)
        // console.log(cnx.canvas.undo)
        cnx.canvas.undo.push({'circle':[points, r]})
        // console.log(cnx.canvas.undo)
    })
}

export function rect(canvas, cnx){
    let r = 5 // redius of circle
    let x = 100,
        y = 100,
        w = 400,
        h = 100;

    function pointer(x, y, w ,h){
        return [
            [x, y],
            [x, y + h],
            [x + w, y],
            [x + w, y + h],
            [x+w/2, y],
            [x+w/2, y + h],
            [x, y + h / 2],
            [x + w, y + h / 2],
        ]
    }

    let points = pointer(x, y, w ,h)

    // draw rect
    function Rect(x, y, w, h) {
        cnx.beginPath()
        cnx.fillStyle = 'rgba(241,18,230,0.36)'
        cnx.fillRect(x, y, w, h)
    }
    Rect(x, y, w, h)
    // draw 8 pointer on it
    points.forEach(point=>{
        cnx.beginPath()
        cnx.fillStyle = '#ff5c00'
        cnx.arc(point[0], point[1], r, 0, 2 * Math.PI)
        cnx.fill()
    })
    // handle drag event
    let rect = canvas.getBoundingClientRect()
    let drag = false
    let index = 0
    canvas.addEventListener('mousedown', (e)=>{
        let x = e.x - rect.left
        let y = e.y - rect.top
        points.forEach((point, i)=>{
            if (onPointer(x, y, point[0], point[1], r)){
                console.log(point, i)
                console.log('true', e)
                drag = true
                index = i
                canvas.className = canvas.classList[0] +' cursor-grab'
            }
        })
    })
    canvas.addEventListener('mousemove', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drag){
            cnx.clearRect(0, 0, 1000, 1000)
            if (index == 0){
                points = pointer(Px, Py, w-Px ,h-Py)
                Rect(Px, Py, w-Px, h-Py)
            }
            if (index = 1){
                points = pointer(Px, Py, w-Px ,h-Py)
                Rect(Px, Py, w-Px, h-Py)
            }
            if (index == 4){
                y = e.y - rect.top
                points = pointer(x, y, w ,h-y)
                Rect(x, y, w, h-y)
            }
            if (index == 5){
                h = e.y - rect.top
                points = pointer(x, y, w ,h-y)
                Rect(x, y, w, h-y)
            }
            if (index == 6){
                x = e.x - rect.left
                points = pointer(x, y, w-x ,h)
                Rect(x, y, w-x, h)
            }
            if (index == 7){
                w = e.x - rect.left
                points = pointer(x, y, w-x ,h)
                Rect(x, y, w-x, h)
            }
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], r, 0, 2 * Math.PI)
                cnx.fill()
            })
            canvas.className = canvas.classList[0] +' cursor-grabbing'
        }
    })
    canvas.addEventListener('mouseup', (e)=>{
        drag = false
        canvas.className = canvas.classList[0] +' cursor-crosshair'
    })
}

export function channel(canvas) {
    let points = []
    let cnx = canvas.getContext('2d')
    // handle drag event
    let rect = canvas.getBoundingClientRect()
    let drag = false,
        drawPoint1 = true,
        drawPoint2 = false,
        index = 0;
    canvas.addEventListener('mousedown', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint1){
            points = [
                [Px, Py],
            ]
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
            drawPoint1 = false
            drawPoint2 = true
        }else {
            points.forEach((point, i) => {
                if (onPointer(Px, Py, point[0], point[1], 5)) {
                    drag = true
                    index = i
                    canvas.className = canvas.classList[0] + ' cursor-grab'
                }
            })
        }
    })
    canvas.addEventListener('mousemove', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint2){
            points = [
                [points[0][0], points[0][1]],
                [Px, Py],
            ]
            cnx.clearRect(0, 0, 1000, 1000)
            cnx.beginPath()
            cnx.strokeStyle = '#002aff'
            cnx.lineWidth = 1.5
            cnx.setLineDash([4,4])
            cnx.moveTo(points[0][0], points[0][1])
            cnx.lineTo(points[1][0], points[1][1]);
            cnx.stroke();
            cnx.beginPath()
            cnx.strokeStyle = '#ff0000'
            cnx.lineWidth = 1.5
            cnx.setLineDash([4,4])
            cnx.moveTo(points[0][0]-100, points[0][1])
            cnx.lineTo(points[0][0]**2, points[0][1]);
            cnx.stroke();
            cnx.beginPath()
            cnx.strokeStyle = '#00ff19'
            cnx.lineWidth = 1.5
            cnx.setLineDash([4,4])
            cnx.moveTo(Px-100, Py)
            cnx.lineTo(Px**2, Py);
            cnx.stroke();
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
        } else {
            // if (drag){
            //     cnx.clearRect(0, 0, 1000, 1000)
            //     if (index == 0){
            //         points = [
            //             [Px, Py],
            //             [points[1][0], points[1][1]],
            //         ]
            //         cnx.beginPath()
            //         cnx.strokeStyle = '#002aff'
            //         cnx.lineWidth = 1.5
            //         cnx.setLineDash([])
            //         cnx.moveTo(points[0][0], points[0][1])
            //         cnx.lineTo(points[1][0], points[1][1]);
            //         cnx.stroke();
            //         points.forEach(point => {
            //             cnx.beginPath()
            //             cnx.fillStyle = '#ff5c00'
            //             cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
            //             cnx.fill()
            //         })
            //     }
            //     if (index == 1){
            //         points = [
            //             [points[0][0], points[0][1]],
            //             [Px, Py],
            //         ]
            //         cnx.beginPath()
            //         cnx.strokeStyle = '#002aff'
            //         cnx.lineWidth = 1.5
            //         cnx.setLineDash([])
            //         cnx.moveTo(points[0][0], points[0][1])
            //         cnx.lineTo(points[1][0], points[1][1]);
            //         cnx.stroke();
            //         points.forEach(point => {
            //             cnx.beginPath()
            //             cnx.fillStyle = '#ff5c00'
            //             cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
            //             cnx.fill()
            //         })
            //     }
            //     canvas.className = canvas.classList[0] +' cursor-grabbing'
            // }
        }
    })
    canvas.addEventListener('mouseup', (e)=>{
        drawPoint2 = false
        drag = false
        canvas.className = canvas.classList[0] +' cursor-crosshair'
    })
}

export function brush(canvas) {
//     ctx.moveTo(20, 20);
// ctx.bezierCurveTo(20, 100, 200, 100, 200, 20);
// ctx.stroke();


//     ctx.beginPath();
// ctx.moveTo(20, 20);
// ctx.quadraticCurveTo(20, 100, 200, 20);
// ctx.stroke();
    let points = []
    let cnx = canvas.getContext('2d')
    let rect = canvas.getBoundingClientRect()
    let drawing = false
    canvas.addEventListener('mousedown' ,(e)=>{
        drawing = true
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        points = [
            [Px, Py]
        ]
    })
    canvas.addEventListener('mousemove', (e)=>{
        if (drawing){
            let Px = e.x - rect.left
            let Py = e.y - rect.top
            points.push([Px, Py])
            cnx.beginPath()
            cnx.strokeStyle = 'rgba(241,18,96,0.36)'
            cnx.lineWidth = 1.5
            cnx.setLineDash([])
            points.forEach(point=>{
                cnx.lineTo(point[0], point[1])
            })
            cnx.stroke();
        }
    })
    canvas.addEventListener('mouseup', ()=>{
        drawing = false
        console.log(cnx.canvas.undo)
        cnx.canvas.undo.push({'brush':points})
        console.log(cnx.canvas.undo)
    })
}

export function line(canvas, draw, xscale, yscale){
    let points = []
    let cnx = canvas.getContext('2d')
    // handle drag event
    let rect = canvas.getBoundingClientRect()
    let drag = false,
        drawPoint1 = true,
        drawPoint2 = false,
        index = 0;
    canvas.addEventListener('mousedown', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint1){
            points = [
                [Px, Py],
            ]
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
            drawPoint1 = false
            drawPoint2 = true
        }else {
            points.forEach((point, i) => {
                if (onPointer(Px, Py, point[0], point[1], 5)) {
                    drag = true
                    index = i
                    canvas.className = canvas.classList[0] + ' cursor-grab'
                }
            })
        }
    })
    canvas.addEventListener('mousemove', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint2){
            points = [
                [points[0][0], points[0][1]],
                [Px, Py],
            ]
            cnx.clearRect(0, 0, 1000, 1000)
            draw(xscale, yscale, e)
            cnx.beginPath()
                cnx.strokeStyle = '#002aff'
                cnx.lineWidth = 1.5
                cnx.setLineDash([])
                cnx.moveTo(points[0][0], points[0][1])
                cnx.lineTo(points[1][0], points[1][1]);
                cnx.stroke();
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
        } else {
            if (drag){
                cnx.clearRect(0, 0, 1000, 1000)
                draw(xscale, yscale, e)
                if (index == 0){
                    points = [
                        [Px, Py],
                        [points[1][0], points[1][1]],
                    ]
                    cnx.beginPath()
                    cnx.strokeStyle = '#002aff'
                    cnx.lineWidth = 1.5
                    cnx.setLineDash([])
                    cnx.moveTo(points[0][0], points[0][1])
                    cnx.lineTo(points[1][0], points[1][1]);
                    cnx.stroke();
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                if (index == 1){
                    points = [
                        [points[0][0], points[0][1]],
                        [Px, Py],
                    ]
                    cnx.beginPath()
                    cnx.strokeStyle = '#002aff'
                    cnx.lineWidth = 1.5
                    cnx.setLineDash([])
                    cnx.moveTo(points[0][0], points[0][1])
                    cnx.lineTo(points[1][0], points[1][1]);
                    cnx.stroke();
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                canvas.className = canvas.classList[0] +' cursor-grabbing'
            }
        }
    })
    canvas.addEventListener('mouseup', (e)=>{
        drawPoint2 = false
        drag = false
        canvas.className = canvas.classList[0] +' cursor-crosshair'
        console.log(cnx.canvas.undo)
        cnx.canvas.undo.push({'line':points})
        console.log(cnx.canvas.undo)
    })
}
export function verticalLine(canvas, draw, xscale, yscale){
    let cnx = canvas.getContext('2d')
    let rect = canvas.getBoundingClientRect()
    console.log('w/h' ,rect.width, rect.height)
    canvas.addEventListener('click', (e)=> {
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        console.log('x/y', Px, Py)
        cnx.beginPath()
        cnx.strokeStyle = 'rgba(241,18,96,0.36)'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(Px, 0)
        cnx.lineTo(Px, rect.height)
        cnx.stroke();
        // console.log(cnx.canvas.undo)
        // cnx.canvas.undo.push({'verticalLine':points})
        // console.log(cnx.canvas.undo)
    })
}
export function horizontalLine(canvas, draw, xscale, yscale){
    let cnx = canvas.getContext('2d')
    let rect = canvas.getBoundingClientRect()
    console.log('w/h' ,rect.width, rect.height)
    canvas.addEventListener('click', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        console.log('x/y', Px, Py)
        cnx.beginPath()
        cnx.strokeStyle = 'rgba(241,18,96,0.36)'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(0, Py)
        cnx.lineTo(rect.width, Py)
        cnx.stroke();
        // console.log(cnx.canvas.undo)
        // cnx.canvas.undo.push({'brush':points})
        // console.log(cnx.canvas.undo)
    })
}
export function vhLine(canvas, draw, xscale, yscale) {
    verticalLine(canvas)
    horizontalLine(canvas)
}

export function trendline(canvas, draw, xscale, yscale){
    // y−y1=y2−y1/x2−x1(x−x1)
    // Find the Y Intercept with two points
  //   const regression = d3.regressionLinear()
  // .x(d => d.x)
  // .y(d => d.y)
  // .domain([0, 100]);
    let points = []
    let cnx = canvas.getContext('2d')
    // handle drag event
    let rect = canvas.getBoundingClientRect()
    let drag = false,
        drawPoint1 = true,
        drawPoint2 = false,
        index = 0;


    canvas.addEventListener('mousedown', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint1){
            points = [
                [Px, Py],
            ]
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
            drawPoint1 = false
            drawPoint2 = true
        }else {
            points.forEach((point, i) => {
                if (onPointer(Px, Py, point[0], point[1], 5)) {
                    drag = true
                    index = i
                    canvas.className = canvas.classList[0] + ' cursor-grab'
                }
            })
        }
    })
    canvas.addEventListener('mousemove', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint2){
            points = [
                [points[0][0], points[0][1]],
                [Px, Py],
            ]
            cnx.clearRect(0, 0, 1000, 1000)
            draw(xscale, yscale, e)
            cnx.beginPath()
                cnx.strokeStyle = '#002aff'
                cnx.lineWidth = 1.5
                cnx.setLineDash([])
                cnx.moveTo(points[0][0], points[0][1])
                cnx.lineTo(points[1][0], points[1][1]);
                cnx.stroke();
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
        } else {
            if (drag){
                cnx.clearRect(0, 0, 1000, 1000)
                draw(xscale, yscale, e)
                if (index == 0){
                    points = [
                        [Px, Py],
                        [points[1][0], points[1][1]],
                    ]
                    cnx.beginPath()
                    cnx.strokeStyle = '#002aff'
                    cnx.lineWidth = 1.5
                    cnx.setLineDash([])
                    cnx.moveTo(points[0][0], points[0][1])
                    cnx.lineTo(points[1][0], points[1][1]);
                    cnx.stroke();
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                if (index == 1){
                    points = [
                        [points[0][0], points[0][1]],
                        [Px, Py],
                    ]
                    cnx.beginPath()
                    cnx.strokeStyle = '#002aff'
                    cnx.lineWidth = 1.5
                    cnx.setLineDash([])
                    cnx.moveTo(points[0][0], points[0][1])
                    cnx.lineTo(points[1][0], points[1][1]);
                    cnx.stroke();
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                canvas.className = canvas.classList[0] +' cursor-grabbing'
            }
        }
    })
    canvas.addEventListener('mouseup', (e)=>{
        drawPoint2 = false
        drag = false

        const y = regression(0, points[0], points[1])
        const y2 = regression(rect.width, points[0], points[1])
        console.log(y, y2)
        cnx.beginPath()
        cnx.strokeStyle = '#002aff'
        cnx.lineWidth = 1.5
        cnx.setLineDash([])
        cnx.moveTo(0, y)
        cnx.lineTo(rect.width, y2);
        cnx.stroke();

        canvas.className = canvas.classList[0] +' cursor-crosshair'

        console.log(cnx.canvas.undo)
        cnx.canvas.undo.push({'trendline':[points, y, y2, rect.width]})
        console.log(cnx.canvas.undo)
    })
}

export function fibRetracement(canvas, draw, xscale, yscale){
    let points = []
    let cnx = canvas.getContext('2d')
    // handle drag event
    let rect = canvas.getBoundingClientRect()
    let drag = false,
        drawPoint1 = true,
        drawPoint2 = false,
        index = 0;

    function fibo(points) {
        const fib = FibonacciRetracement(points[0][1], points[1][1])
        for (const fibKey in fib) {
            cnx.beginPath()
            cnx.strokeStyle = '#ff00aa'
            cnx.lineWidth = 1.5
            cnx.setLineDash([])
            cnx.moveTo(points[0][0], fib[fibKey])
            cnx.lineTo(points[1][0], fib[fibKey]);
            cnx.stroke();

            cnx.beginPath()
            cnx.fillStyle = 'black'
            cnx.font = "12px serif"
            cnx.fillText(`${fibKey} (${fib[fibKey]})`, points[0][0], fib[fibKey])
        }
    }

    canvas.addEventListener('mousedown', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint1){
            points = [
                [Px, Py],
            ]
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
            drawPoint1 = false
            drawPoint2 = true
        }else {
            points.forEach((point, i) => {
                if (onPointer(Px, Py, point[0], point[1], 5)) {
                    drag = true
                    index = i
                    canvas.className = canvas.classList[0] + ' cursor-grab'
                }
            })
        }
    })
    canvas.addEventListener('mousemove', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint2){
            points = [
                [points[0][0], points[0][1]],
                [Px, Py],
            ]
            cnx.clearRect(0, 0, 1000, 1000)
            draw(xscale, yscale, e)
            fibo(points)
            cnx.beginPath()
                cnx.strokeStyle = '#002aff'
                cnx.lineWidth = 1.5
                cnx.setLineDash([])
                cnx.moveTo(points[0][0], points[0][1])
                cnx.lineTo(points[1][0], points[1][1]);
                cnx.stroke();
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
        } else {
            if (drag){
                cnx.clearRect(0, 0, 1000, 1000)
                draw(xscale, yscale, e)
                if (index == 0){
                    points = [
                        [Px, Py],
                        [points[1][0], points[1][1]],
                    ]
                    fibo(points)
                    cnx.beginPath()
                    cnx.strokeStyle = '#002aff'
                    cnx.lineWidth = 1.5
                    cnx.setLineDash([])
                    cnx.moveTo(points[0][0], points[0][1])
                    cnx.lineTo(points[1][0], points[1][1]);
                    cnx.stroke();
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                if (index == 1){
                    points = [
                        [points[0][0], points[0][1]],
                        [Px, Py],
                    ]
                    fibo(points)
                    cnx.beginPath()
                    cnx.strokeStyle = '#002aff'
                    cnx.lineWidth = 1.5
                    cnx.setLineDash([])
                    cnx.moveTo(points[0][0], points[0][1])
                    cnx.lineTo(points[1][0], points[1][1]);
                    cnx.stroke();
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                canvas.className = canvas.classList[0] +' cursor-grabbing'
            }
        }
    })
    canvas.addEventListener('mouseup', (e)=>{
        drawPoint2 = false
        drag = false
        canvas.className = canvas.classList[0] +' cursor-crosshair'
        console.log(cnx.canvas.undo)
        cnx.canvas.undo.push({'fibRetracement':points})
        console.log(cnx.canvas.undo)
    })
}

export function range(canvas, draw, xscale, yscale){
    let points = []
    let cnx = canvas.getContext('2d')
    // handle drag event
    let rect = canvas.getBoundingClientRect()
    let drag = false,
        drawPoint1 = true,
        drawPoint2 = false,
        index = 0;

    function range(points){
        const point1 = points[0]
        const point2 = points[1]
        cnx.beginPath()
        cnx.fillStyle = (point1[1] === point2[1]) ? "silver" : (point1[1] < point2[1]) ? "rgba(239,83,80,0.3)" : "rgba(38,166,154,0.3)"
        cnx.fillRect(point1[0], (point1[1] < point2[1]) ? point1[1] : point2[1], Math.abs(point2[0]-point1[0]), Math.abs(point2[1]-point1[1]))

        cnx.beginPath()
        cnx.fillStyle = 'black'
        cnx.font = "12px serif"
        const text = `p1:${point1[1]}-p2:${point2[1]}-prcent:${Math.abs(point2[1]-point1[1])/100}`
        cnx.fillText(text, point1[0], point1[1])
    }

    canvas.addEventListener('mousedown', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint1){
            points = [
                [Px, Py],
            ]
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
            drawPoint1 = false
            drawPoint2 = true
        }else {
            points.forEach((point, i) => {
                if (onPointer(Px, Py, point[0], point[1], 5)) {
                    drag = true
                    index = i
                    canvas.className = canvas.classList[0] + ' cursor-grab'
                }
            })
        }
    })
    canvas.addEventListener('mousemove', (e)=>{
        let Px = e.x - rect.left
        let Py = e.y - rect.top
        if (drawPoint2){
            points = [
                [points[0][0], points[0][1]],
                [Px, Py],
            ]
            cnx.clearRect(0, 0, 1000, 1000)
            draw(xscale, yscale, e)
            range(points)
            cnx.beginPath()
                cnx.strokeStyle = '#002aff'
                cnx.lineWidth = 1.5
                cnx.setLineDash([])
                cnx.moveTo(points[0][0], points[0][1])
                cnx.lineTo(points[1][0], points[1][1]);
                cnx.stroke();
            points.forEach(point => {
                cnx.beginPath()
                cnx.fillStyle = '#ff5c00'
                cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                cnx.fill()
            })
        } else {
            if (drag){
                cnx.clearRect(0, 0, 1000, 1000)
                draw(xscale, yscale, e)
                if (index == 0){
                    points = [
                        [Px, Py],
                        [points[1][0], points[1][1]],
                    ]
                    range(points)
                    cnx.beginPath()
                    cnx.strokeStyle = '#002aff'
                    cnx.lineWidth = 1.5
                    cnx.setLineDash([])
                    cnx.moveTo(points[0][0], points[0][1])
                    cnx.lineTo(points[1][0], points[1][1]);
                    cnx.stroke();
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                if (index == 1){
                    points = [
                        [points[0][0], points[0][1]],
                        [Px, Py],
                    ]
                    range(points)
                    cnx.beginPath()
                    cnx.strokeStyle = '#002aff'
                    cnx.lineWidth = 1.5
                    cnx.setLineDash([])
                    cnx.moveTo(points[0][0], points[0][1])
                    cnx.lineTo(points[1][0], points[1][1]);
                    cnx.stroke();
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                canvas.className = canvas.classList[0] +' cursor-grabbing'
            }
        }
    })
    canvas.addEventListener('mouseup', (e)=>{
        drawPoint2 = false
        drag = false
        canvas.className = canvas.classList[0] +' cursor-crosshair'

        console.log(cnx.canvas.undo)
        cnx.canvas.undo.push({'range':points})
        console.log(cnx.canvas.undo)
    })
}












function Drawer({
                    width = 640,
                    height = 480,
                    curve: Curve = d3.curveBasis,
                    stroke = "black",
                    strokeWidth = 1.5,
                    lineCap = "round",
                    lineJoin = "round",
                } = {}) {
    const context = DOM.context2d(width, height);
    const strokes = context.canvas.value = [];
    const curve = Curve(context);
    const redo = [];

    context.lineJoin = lineJoin;
    context.lineCap = lineCap;

    // Render and report the new value.
    function render() {
        context.clearRect(0, 0, width, height);
        for (const stroke of strokes) {
            context.strokeStyle = stroke.stroke;
            context.lineWidth = stroke.strokeWidth;
            context.beginPath();
            curve.lineStart();
            for (const point of stroke) {
                curve.point(...point);
            }
            if (stroke.length === 1) curve.point(...stroke[0]);
            curve.lineEnd();
            context.stroke();
        }
        context.canvas.value = strokes;
        context.canvas.dispatchEvent(new CustomEvent("input"));
    }

    d3.select(context.canvas).call(d3.drag()
        .container(context.canvas)
        .subject(dragsubject)
        .on("start drag", dragged)
        .on("start.render drag.render", render));

    context.canvas.undo = () => {
        if (strokes.length === 0) return;
        redo.push(strokes.pop());
        render();
    };

    context.canvas.redo = stroke => {
        if (redo.length === 0) return;
        strokes.push(redo.pop());
        render();
    };

    // Create a new empty stroke at the start of a drag gesture.
    function dragsubject() {
        const currentStroke = [];
        currentStroke.stroke = typeof stroke === "function" ? stroke() : stroke;
        currentStroke.strokeWidth = typeof strokeWidth === "function" ? strokeWidth() : strokeWidth;
        strokes.push(currentStroke);
        redo.length = 0;
        return currentStroke;
    }

    // Add to the stroke when dragging.
    function dragged({subject, x, y}) {
        subject.push([x, y]);
    }

    return context.canvas;
}

// viewof
// Drawer({
//     width:100,
//     height: 500,
//     stroke: () =>  stroke.value,
//     strokeWidth: () =>  strokeWidth.value
// })

// cross
// line
// horizontal
// ray
// forecast
// price
// range
// date
// range
// measure


// draw
// circle
// with border.context.arc(canvas.width / 2, canvas.height / 2, 70, 0, 2 * Math.PI, false);
// context.fillStyle = "#8ED6FF";
// context.fill();
// context.lineWidth = 5;
// context.strokeStyle = "black";
// context.stroke();


function arrow(p1, p2, size) {
    var angle = Math.atan2((p2.y - p1.y), (p2.x - p1.x));
    var hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));

    ctx.save();
    ctx.translate(p1.x, p1.y);
    ctx.rotate(angle);

    // line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(hyp - size, 0);
    ctx.stroke();

    // triangle
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.lineTo(hyp - size, size);
    ctx.lineTo(hyp, 0);
    ctx.lineTo(hyp - size, -size);
    ctx.fill();

    ctx.restore();
}

function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}




