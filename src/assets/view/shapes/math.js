export function createVector(x, y) {
    return {x: x, y: y}
}

export function dist(x1, y1, x2, y2) {
    // circle formula :: c(o, r): (x-a)^2+(y-b)^2=r^2
    // o(a, b) ==> coorinates of the center of the circle
    // let c = Math.abs(x-a)**2 + Math.abs(y-b)**2
    // let dist = (x1 - x2) ** 2 + (y1 - y2) ** 2
    let absX = Math.abs(x2 - x1)
    let absY = Math.abs(y2 - y1)
    let dist = Math.sqrt((absX ** 2 + absY ** 2))
    return dist
}


export function calPoint(e){
    let canvas = e.target
    let rect = canvas.getBoundingClientRect()
    return {x:e.x - rect.left, y:e.y - rect.top}
}