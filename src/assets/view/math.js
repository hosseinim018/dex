import * as d3 from "d3";
import {grid} from "@/assets/chart/axis/axis";
import {Lable} from "@/assets/chart/tools/Lable";
import {chart, Charts} from "@/assets/chart/charts/chart";
import {crosshair} from "@/assets/chart/tools/crosshaire";
import {indicator} from "@/assets/chart/indicator/indicator";
import {Zoom, ZoomClass} from "@/assets/chart/zoom/zoom";
import {brush, circle, fibRetracement, line} from "@/assets/chart/shapes/pointer";
import {emitter} from "@/emitter";
import {shape} from "@/assets/chart/shapes/shape";

const print = console.log;

const chartConfig = {
    width:1500,
    height:600,
    margin: {top: 20, right: 50, bottom: 20, left: 40},
    id: 'test',
    data: null,
    indicators: [{
        type: 'rsi',
        data: null,
    }],
    tools: [
        {trendlinr: null, data:null},
        {fibonacci: null, data:null},
        {channel: null,  data:null},
    ],
    legend: null,
}

export function mainChart(config) {
    let width = (config.width) ? config.width : 600,
        height = (config.height) ? config.height : 400,
        id = (config.id) ? config.id : console.error("id is't valid\n"+ config.id),
        margin = config.margin,
        data = config.data,
        h = config.h


    let yscale = d3.scaleLinear()
        .domain([d3.min(data.map(d => d[3])), d3.max(data.map(d => d[2]))])
        .range([2*h, 0]).nice();
        // .range([height - margin.bottom, 0]).nice();


    let xscale = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d[0])))
        .range([0, width - margin.right]).nice();

    let xb = d3.scaleBand()
        .domain(data.map(d => d[0]))
        .range([0, width - margin.right]).padding(0.3);

    let canvas = document.getElementById(id)

    let cnx = canvas.getContext('2d')

    cnx.canvas.undo = [];
    cnx.canvas.redo = [];

    function renderItems() {
        cnx.canvas.undo.forEach(item => {
            for (const itemKey in item) {
                // render cricle
                if (itemKey == 'circle') {
                    console.log(item[itemKey])
                    let points = item[itemKey][0]
                    let r = item[itemKey][1]

                    function Circle(x, y, r) {
                        cnx.beginPath()
                        cnx.fillStyle = 'rgba(241,18,230,0.36)'
                        cnx.arc(x, y, r, 0, 2 * Math.PI)
                        cnx.fill()
                    }

                    Circle(points[0][0], points[0][1], r)
                    points.forEach(point => {
                        cnx.beginPath()
                        cnx.fillStyle = '#ff5c00'
                        cnx.arc(point[0], point[1], 5, 0, 2 * Math.PI)
                        cnx.fill()
                    })
                }
                // render brush
                if (itemKey == 'brush') {
                    let points = item[itemKey]
                    cnx.beginPath()
                    cnx.strokeStyle = 'rgba(241,18,96,0.36)'
                    cnx.lineWidth = 1.5
                    cnx.setLineDash([])
                    points.forEach(point => {
                        cnx.lineTo(point[0], point[1])
                    })
                    cnx.stroke();
                }
                // render line
                if (itemKey == 'line') {
                    let points = item[itemKey]
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
            }
        })
    }

    function undo(){
        if (cnx.canvas.undo.length === 0) return;
        cnx.canvas.redo.push(cnx.canvas.undo.pop());
        renderItems()
    }

    function redo() {
        if (cnx.canvas.redo.length === 0) return;
        cnx.canvas.undo.push(redo.pop());
        renderItems()
    }


    let xaxis = d3.select('#x-' + id)
    let yaxis = d3.select('#y-' + id)
    let cnxXaxis = xaxis.node().getContext('2d')
    let cnxYaxis = yaxis.node().getContext('2d')

    let lastData = data[data.length - 1]

    // indicator
    let type = 'rsi'
    let ind = indicator(id, type, margin, cnxXaxis, data)
    let yindscale = ind.scale()
    let yCanvas = d3.select('#yIndicator-' + id + type)
    let indCanvas = d3.select('#indicator-' + id + type)


    // let wma = config.indicators.wma ? config.indicators.wma.data : null

    // define zoom event for y plot indicator
    const zoomX = d3.zoom();
    const zoomY = d3.zoom();
    indCanvas.call(zoomX).attr("pointer-events", "none");
    yCanvas.call(zoomY).attr("pointer-events", "none");
    // yCanvas.call(d3.zoom().on('zoom', zoomYind));
    // indCanvas.call(d3.zoom().on('zoom', zoomPlotInd));
    const tyi = () => d3.zoomTransform(yCanvas.node());
    const txi = () => d3.zoomTransform(indCanvas.node());

    var shapes;
    var rectToDrag;
    let p;
    // setup
    shapes = [];
    // rectToDrag = new shape.Rectangle(50, 50, 200, 200);
    // rectToDrag.dragEnabled = true;
    // rectToDrag.fillColor = 'rgba(241,18,230,0.36)';
    // shapes.push(rectToDrag);
    // p = new Point(400, 100)
    // p.dragEnabled = true;
    // shapes.push(p)
    // let circle = new Circle(400, 100, 100)
    // circle.dragEnabled = true;
    // shapes.push(circle)
    // let vl = new shape.verticalLine(400, canvas)
    // vl.dragEnabled = true
    // shapes.push(vl)
    // let hl = new shape.horizontalLine(100, canvas)
    // hl.dragEnabled = true
    // shapes.push(hl)
    // let cl = new shape.crossLine(400, 100, canvas)
    // cl.dragEnabled = true
    // shapes.push(cl)
    // let trline = new shape.trendline(100, 600, 100, 100)
    // trline.dragEnabled = true
    // shapes.push(trline)
    // let rel = new shape.reyLine(300, 500, 100, 100)
    // rel.dragEnabled = true
    // shapes.push(rel)
    // let fibo = new shape.fibonacciRetracement(300, 500, 200, 100)
    // fibo.dragEnabled = true
    // shapes.push(fibo)
    // let rng = new shape.Range(300, 500, 200, 100)
    // rng.dragEnabled = true
    // shapes.push(rng)
    // let rect = new shape.Rect(50, 50, 200, 200)
    // rect.dragEnabled = true
    // shapes.push(rect)
    // let Triangle = new shape.Triangle(50 ,200, 50, 100, 100, 100)
    // Triangle.dragEnabled = true
    // shapes.push(Triangle)
    // let channel = new shape.Channel(100, 50,50, 400, 200)
    // channel.dragEnabled = true
    // shapes.push(channel)
    // let br = new shape.Brush()
    // br.dragEnabled = true
    // shapes.push(br)
    let charts = []
    let linechart = new Charts.Line(data)
    linechart.fillColor = '#42b455'
    linechart.call()
    charts.push(linechart)
    let smalin = new Charts.Sma(data)
    smalin.fillColor = '#0608ef'
    smalin.call(200)
    charts.push(smalin)
    let emalin = new Charts.Ema(data)
    emalin.fillColor = '#a13f00'
    emalin.call(200)
    charts.push(emalin)
    let wmalin = new Charts.Wma(data)
    wmalin.fillColor = '#8506c4'
    wmalin.call(200)
    charts.push(wmalin)
    let candelstick = new Charts.Candelstick(data)
    // charts.push(candelstick)


    function draw(xr, yr, e) {
        cnx.clearRect(0, 0, width, height);
        cnxYaxis.clearRect(0, 0, width, height);
        cnxXaxis.clearRect(0, 0, width, height);
        grid(cnx, cnxYaxis, cnxXaxis, xr, yr, height, width)
        // Lable
        let lable = Lable(cnx, cnxYaxis, yr, width, margin, lastData)
        lable.line()
        lable.lable()
        // charts
        charts.forEach(chart => chart.draw(canvas, xr, yr))
        chart.candles(cnx, data, xb, xr, yr)
        // indicator
        const yrInd = tyi().rescaleY(yindscale);
        ind.draw(xr, yrInd, xb, e)


        // volume(data, cnx, xr, yscale, xb, height)

        // crosshair
        let mouse = d3.pointer(e);
        let x = mouse[0];
        let y = mouse[1];
        crosshair(x, y, cnxYaxis, cnxXaxis, xr, yr, margin)

        shapes.forEach(shape => shape.draw(canvas));
    }

    function mousedown(e) {
        shapes.filter(s => s.dragEnabled)
            .find(s => s.mousedown(e));

    }

    function mousemove(e) {
        shapes.filter(s => s.isDragged)
            .forEach(s => s.mousemove(e));
        const xr = tx().rescaleX(xscale);
        const yr = ty().rescaleY(yscale);
        draw(xr, yr, e)
    }

    function mouseup(e) {
        shapes.filter(s => s.isDragged)
            .forEach(s => s.mouseup(e));
    }

    d3.select('#' + id).on("mousedown", mousedown)
    d3.select('#' + id).on("mousemove", mousemove)
    d3.select('#' + id).on("mouseup", mouseup)

    // The d3.zoomTransform() Function in D3.js is used to get the current transform for the specified node.
    // d3.zoomTransform(node)
    // Object { k: 1, x: 0, y: 0 }
    const tx = () => d3.zoomTransform(xaxis.node());
    const ty = () => d3.zoomTransform(yaxis.node());


    let myzoom = Zoom(width, height, margin, xaxis, yaxis, xscale, yscale, xb, draw)
    let Canvaszoom = d3.zoom().on('zoom', myzoom.mainPlot)
    d3.select('#' + id).call(Canvaszoom.transform, d3.zoomIdentity.scale(1))
    // d3.select('#' + id).call(Canvaszoom);
    let Axiszoom = d3.zoom().on('zoom', myzoom.axisPlot)
    yaxis.call(Axiszoom);
    xaxis.call(Axiszoom);


    function zoomYind(e){
        const xr = tx().rescaleX(xscale);
        const yr = tyi().rescaleY(yindscale);
        ind.draw(xr, yr,xb, e)
    }

    function zoomPlotInd(e) {
        const xr = txi().rescaleX(xscale);
        const yr = ty().rescaleY(yscale);
        draw(xr, yr,xb, e)
    }

    // check which tools is active
    emitter.on('leftMenuTools', tool =>{
        for (let value in tool) {
            if (tool[value] == true){
                console.log(value +' '+ tool[value])
            }
        }
        if (tool['crosshair'] == true) {
            console.log('crosshair is actvie so zoom on')
            let Canvaszoom = d3.zoom().on('zoom', myzoom.mainPlot)
            let Axiszoom = d3.zoom().on('zoom', myzoom.axisPlot)
            d3.select('#' + id).call(Canvaszoom.transform, d3.zoomIdentity.scale(1))
            d3.select('#' + id).call(Canvaszoom);
            yaxis.call(Axiszoom);
            xaxis.call(Axiszoom);
        } else {
            console.log('zoom off')
            let Axiszoom = d3.zoom().on('zoom', null)
            let Canvaszoom = d3.zoom().on('zoom', null)
            d3.select('#' + id).call(Canvaszoom);
            yaxis.call(Axiszoom);
            xaxis.call(Axiszoom);

            if (tool['brush'] == true){
                brush(canvas, draw, xscale, yscale)
                renderItems()
            }
            if (tool['line'] == true){
                line(canvas, draw, xscale, yscale)
                renderItems()
            }
            if (tool['fibonacci'] == true){
                fibRetracement(canvas, draw, xscale, yscale)
                renderItems()
            }
        }
    })
    const undoitem = document.getElementById('undo')
    undoitem.addEventListener('click', e=>{
        console.log('undo')
        undo()
    })

}
