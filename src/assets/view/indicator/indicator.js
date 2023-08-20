import * as d3 from "d3";
import {grid} from "@/assets/chart/axis/axis";
import {Lable} from "@/assets/chart/tools/Lable";
import {adx, macd, cci} from "@/assets/chart/indicator/math";

function mean(series) {
    let sum = 0;
    for (let i = 0; i < series.length; i++) {
        sum += series[i];
    }
    return sum / series.length;
}
function rolling(operation, series, window) {
    let result = [];
    for (let i = 0, len = series.length; i < len; i++) {
        let j = i + 1 - window;
        result.push(operation(series.slice((j > 0) ? j : 0, i + 1)));
    }
    return result;
}

function sma(series, window) {
    return rolling((s) => mean(s), series, window);
}

function ema(series, window, start) {
    let weight = 2 / (window + 1);
    let ema = [start ? start : mean(series.slice(0, window))];
    for (let i = 1, len = series.length; i < len; i++) {
        ema.push(series[i] * weight + (1 - weight) * ema[i - 1]);
    }
    return ema;
}


export function Dataframe(data){
    // How many columns has data?
    let columnsLen = data[0].length
    // create Dataframe as a object
    let dic = {
        values : ()=>{
            let arr = {}
            let old_arr = Object.values(dic)
            for (let i = 0; i < old_arr.length; i++){
                for (let j = 0; j < old_arr[i].length; j++){
                    if (i === 0){
                        arr[j] = []
                    }
                    arr[j][i] = old_arr[i][j]
                }
            }
            return Object.values(arr)
        }
    }
    // create columns for Dataframe
    for (let i = 0; i<columnsLen; i++){
        dic[i] = data.map(d=>d[i])
    }
    // return Dataframe
    Dataframe.data = () => {
        return dic
    }
    // filter data based on columns
    Dataframe.filter = (list) => {
        return Object.keys(dic)
        .filter(key => list.includes(key))
        .reduce((obj, key) => {
            obj[key] = dic[key];
            return obj;
        }, {});
    }
    // slice data based on columns
    Dataframe.slice = (start, end) => {
        return Object.keys(dic)
        .slice(start, end)
        .reduce((obj, key) => {
            obj[key] = dic[key];
            return obj;
        }, {})
    }
    // rename columns
    Dataframe.columns = (list) => {
        let dickey = Object.keys(dic)
        for (let i = 0; i < list.length; i++){
            dic[list[i]] = dic[dickey[i]];
            delete dic[dickey[i]];
        }
    }
    // show n number of row each column
    Dataframe.head = (num) => {
        num = typeof num === 'number' ? num : parseInt(num)
        return Object.keys(dic).reduce((obj, key) => {
            obj[key] = dic[key].slice(0, num);
            return obj;
        }, {})
    }
    return Dataframe
}

function Get(url) {
    let request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest(); //access to ajax
    } else {
        request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //send request (request type, url, async :defualt true => async if false sync)
    request.open('GET', url, false);
    request.send();
    return  JSON.parse(request.responseText)
}
let config = {
    color: '#ffa800',
    lineWidth: 1,
    period: 14,
    data: null,
    base: 'close',
    cnx: null,
    xscale: null,
    yscale: null
}

export function Line(config) {
    let base = config.base == 'close' ? 4 : (config.base == 'open') ? 1 : (config.base == 'low') ? 2 : (config.base == 'high') ? 3 : null
    let data = config.data
    let lineWidth = config.lineWidth ? config.lineWidth : 1
    let cnx = config.cnx ? config.cnx : null
    let color = config.color ? config.color : '#ffa800'
    let xscale = config.xscale ? config.xscale : null
    let yscale = config.yscale ? config.yscale : null
    let prev = 0
    let prevd = 0
    let i = 1
    data.forEach(d => {
        if (i == 1) {
            prev = d[base]
            prevd = d[0]
            i = 2
        }
        cnx.beginPath()
        cnx.strokeStyle = color
        cnx.lineWidth = lineWidth
        cnx.moveTo(xscale(prevd), yscale(prev))
        cnx.lineTo(xscale(d[0]), yscale(d[base]));
        prev = d[base]
        prevd = d[0]
        cnx.stroke();
    });
}


export function RSI(config){
    config = {
        color: '#ffa800',
        lineWidth: 1,
        period: config.period ? config.period : 14,
        data: config.data ? config.data : null,
        base: config.base == 'close' ? 2 : null,
        cnx: config.cnx,
        xscale: config.xscale,
        yscale: config.yscale
    }
    Line(config)
    config.cnx.beginPath()
    config.cnx.fillStyle = 'blue'
    config.cnx.fillRect(0, config.yscale(90), config.width, config.yscale(30))
}

function line2(data, context, xscale, yscale) {
    let prev = 0
    let prevd = 0
    let i = 1
    data.forEach(d => {
        if (i == 1) {
            prev = d[2]
            prevd = d[0]
            i = 2
        }
        context.beginPath()
        context.strokeStyle = '#1474c9'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevd), yscale(prev))
        context.lineTo(xscale(d[0]), yscale(d[2]));
        prev = d[2]
        prevd = d[0]
        context.stroke();
    });
}
function rsisma(data, context, xscale, yscale) {
    let prev = 0
    let prevd = 0
    let i = 1
    data.forEach(d => {
        if (i == 1) {
            prev = d[3]
            prevd = d[0]
            i = 2
        }
        context.beginPath()
        context.strokeStyle = '#ff8c00'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevd), yscale(prev))
        context.lineTo(xscale(d[0]), yscale(d[3]));
        prev = d[3]
        prevd = d[0]
        context.stroke();
    });
}




function MACD(data, context, xscale, yscale, xb) {
    const frame = Dataframe(data)
    // frame.columns(['open_time', 'open', 'high', 'low', 'close', 'volume', 'close_time'])
    const df = frame.slice(0, 5)
    df['open_time'] = df[0]
    df['close'] = df['4'].map(parseFloat)
    df['high'] = df['2'].map(parseFloat)
    df['low'] = df['3'].map(parseFloat)
    // df['cci'] = cci(df['high'], df['low'], df['close'])
    df['macd'] = macd(df['close'], 12, 26, 9)
    df['macd']['open_time'] = df['open_time']
    // console.log('cci:',df['cci'])
    console.log(df)
    //histogram
    for (let i = 0; i < df['macd']['hist'].length; i++) {
        let d = Object.keys(df['macd']).map(key => df['macd'][key][i])
        console.log(d)
        context.beginPath()
        context.fillStyle = (d[2] === d[0]) ? "silver" : (d[2] < 0) ? "#EF5350" : "#26A69A"
        context.fillRect(xscale(d[3]) - xb.bandwidth() / 2, yscale(0), xb.bandwidth(), yscale(d[2]) - yscale(0))
    }
    let prev = 0
    let prevd = 0
    let t = 1
    for (let i = 0; i < df['macd']['line'].length; i++) {
        let d = Object.keys(df['macd']).map(key => df['macd'][key][i])
        // console.log(d)
        if (t == 1) {
            prev = d[0]
            prevd = d[3]
            t = 7
        }
        context.beginPath()
        context.strokeStyle = '#0055ff'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevd), yscale(prev))
        context.lineTo(xscale(d[3]), yscale(d[0]));
        prev = d[0]
        prevd = d[3]
        context.stroke();
    }
    let prevs = 0
    let prevds = 0
    let g = 1
    for (let i = 0; i < df['macd']['signal'].length; i++) {
        let d = Object.keys(df['macd']).map(key => df['macd'][key][i])
        if (g == 1) {
            prevs = d[1]
            prevds = d[3]
            g = 7
        }
        context.beginPath()
        context.strokeStyle = '#ffaa00'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevds), yscale(prevs))
        context.lineTo(xscale(d[3]), yscale(d[1]));
        prevs = d[1]
        prevds = d[3]
        context.stroke();
    }

}

function ADX(data, context, xscale, yscale) {
    const frame = Dataframe(data)
    const df = frame.slice(0, 5)
    df['open_time'] = df[0]
    df['close'] = df['4'].map(parseFloat)
    df['high'] = df['2'].map(parseFloat)
    df['low'] = df['3'].map(parseFloat)
    df['adx'] = adx(df['high'], df['low'], df['close'], 14)
    df['adx']['open_time'] = df['open_time']
    //adx
    let prev = 0
    let prevd = 0
    let t = 1
    for (let i = 0; i < df['adx']['adx'].length; i++) {
        let d = Object.keys(df['adx']).map(key => df['adx'][key][i])
        console.log('adx', d)
        if (t == 1) {
            prev = d[2]
            prevd = d[3]
            t = 7
        }
        context.beginPath()
        context.strokeStyle = '#00ff40'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevd), yscale(prev))
        context.lineTo(xscale(d[3]), yscale(d[2]));
        prev = d[2]
        prevd = d[3]
        context.stroke();
    }
    //dip
    let prevdi = 0
    let prevddi = 0
    let tdi = 1
    for (let i = 0; i < df['adx']['dip'].length; i++) {
        let d = Object.keys(df['adx']).map(key => df['adx'][key][i])
        if (tdi == 1) {
            prevdi = d[0]
            prevddi = d[3]
            tdi = 7
        }
        context.beginPath()
        context.strokeStyle = '#ff0000'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevddi), yscale(prevdi))
        context.lineTo(xscale(d[3]), yscale(d[0]));
        prevdi = d[0]
        prevddi = d[3]
        context.stroke();
    }
    //dim
    let prevdim = 0
    let prevddim = 0
    let tdim = 1
    for (let i = 0; i < df['adx']['dim'].length; i++) {
        let d = Object.keys(df['adx']).map(key => df['adx'][key][i])
        if (tdim == 1) {
            prevdim = d[1]
            prevddim = d[3]
            tdim = 7
        }
        context.beginPath()
        context.strokeStyle = '#0055ff'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevddim), yscale(prevdim))
        context.lineTo(xscale(d[3]), yscale(d[1]));
        prevdim = d[1]
        prevddim = d[3]
        context.stroke();
    }
}

function CCI(data, context, xscale, yscale) {
    const frame = Dataframe(data)
    const df = frame.slice(0, 5)
    df['open_time'] = df[0]
    df['close'] = df['4'].map(parseFloat)
    df['high'] = df['2'].map(parseFloat)
    df['low'] = df['3'].map(parseFloat)
    df['cci'] = cci(df['high'], df['low'], df['close'], 20, 0.015)
    // console.log('cci', df)
    let prev = 0
    let prevd = 0
    let t = 1
    for (let i = 0; i < df['cci'].length; i++) {
        let d = Object.keys(df).map(key => df[key][i])
        // console.log('cci', d)
        if (t == 1) {
            prev = d[9]
            prevd = d[0]
            t = 7
        }
        context.beginPath()
        context.strokeStyle = '#00ff40'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevd), yscale(prev))
        context.lineTo(xscale(d[0]), yscale(d[9]));
        prev = d[9]
        prevd = d[0]
        context.stroke();
    }
}

export function indicator(id, type, margin, xcontext,datum) {
    let data
    if (type == 'rsi'){
        let request;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest(); //access to ajax
        } else {
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        //send request (request type, url, async :defualt true => async if false sync)
        request.open('GET', 'http://127.0.0.1:8000/indicator/rsi/20/btcusdt', false);
        request.send();
        data = JSON.parse(request.responseText)
        // console.log(data)
    }

    // select canvas based on id and create a context 2d for canvas
    let canvas = document.getElementById('indicator-' + id + type)
    let context = canvas.getContext('2d')
    // get size of canvas
    let width = canvas.clientWidth
    let height = canvas.clientHeight
    // select y axis canvas based on id and create a context 2d for it
    let yCanvas = d3.select('#yIndicator-' + id + type)
    let ycontext = yCanvas.node().getContext('2d')
    // get size of yCanvas
    let width_yAxis = yCanvas.clientWidth
    let height_yAxis = yCanvas.clientHeight
    // define yscale for canvas
    let yscale = d3.scaleLinear().range([height, 0]).nice();
    if (type == 'macd') {
        data = datum
        const frame = Dataframe(data)
        const df = frame.slice(0, 5)
        df['open_time'] = df[0]
        df['close'] = df['4'].map(parseFloat)
        df['high'] = df['2'].map(parseFloat)
        df['low'] = df['3'].map(parseFloat)
        df['macd'] = macd(df['close'], 12, 26, 9)
        console.log('macd', df['macd']['line'])
        yscale.domain(d3.extent(df['macd']['line'], d => d))
    }
    if (type =='adx'){
        data = datum
        const frame = Dataframe(data)
        const df = frame.slice(0, 5)
        df['open_time'] = df[0]
        df['close'] = df['4'].map(parseFloat)
        df['high'] = df['2'].map(parseFloat)
        df['low'] = df['3'].map(parseFloat)
        df['adx'] = adx(df['high'], df['low'], df['close'], 14)
        yscale.domain(d3.extent(df['adx']['adx'], d => d))
    }
    if (type =='cci'){
        data = datum
        const frame = Dataframe(data)
        const df = frame.slice(0, 5)
        df['open_time'] = df[0]
        df['close'] = df['4'].map(parseFloat)
        df['high'] = df['2'].map(parseFloat)
        df['low'] = df['3'].map(parseFloat)
        df['cci'] = cci(df['high'], df['low'], df['close'], 20, 0.015)
        yscale.domain(d3.extent(df['cci'], d => d))
    }
    if (type == 'rsi'){
        yscale.domain(d3.extent(data, d => d[2]))
    }
    // get last item from data
    let lastData = data[data.length - 1]

    // define a drawing function for draw on canvas
    function draw(xscale, yscale, xb, e) {
        context.clearRect(0, 0, width, height);
        ycontext.clearRect(0, 0, width, height);
        xcontext.clearRect(0, 0, width, height);
        grid(context, ycontext, xcontext, xscale, yscale, height, width)
        let lable = Lable(context, ycontext, yscale, width, margin, lastData, "#3683e3")
        lable.line(2)
        lable.lable(2)
        if (type == 'macd'){
           MACD(datum, context, xscale, yscale, xb)
        }
        if (type == 'adx'){
            ADX(data, context, xscale, yscale)
        }
        if (type =='cci'){
            CCI(data, context, xscale, yscale)
        }
        if (type == 'rsi') {
            context.beginPath()
            // context.globalAlpha = 0.5
            context.fillStyle = 'rgba(125,232,59,0.08)'
            context.fillRect(0, yscale(70), width, yscale(30)- yscale(70))
            let config = {
                color: '#6d0000',
                lineWidth: 1,
                period: 14,
                data: data,
                base: 'close',
                cnx: context,
                xscale: xscale,
                yscale: yscale,
                width: width
            }
            line2(data, context, xscale, yscale)
            rsisma(data, context, xscale, yscale)
        //     let config = {
        //         color: '#006d6b',
        //         lineWidth: 1,
        //         period: 14,
        //         data: data,
        //         base: 'close',
        //         cnx: context,
        //         xscale: xscale,
        //         yscale: yscale,
        //         width: width
        //     }
        //     RSI(config)
        }
        // let mouse = d3.pointer(e);
        // let x = mouse[0];
        // let y = mouse[1];
        // crosshair(x, y, ycontext, xcontext, xscale, yscale)
    }
    indicator.scale = () => {
        return yscale
    }
    indicator.draw = (xr, yr, e) => {
        draw(xr, yr, e)
    }
    return indicator
}

export function SMA(data, context, xscale, yscale) {
    const frame = Dataframe(data)
    const df = frame.filter(['0', '1', '2', '3', '4', '5', '6'])
    // console.log('cal sma')
    let newFrame = {}
    newFrame['open_time'] = df['0']
    newFrame['open'] = df['1'].map(parseFloat)
    newFrame['high'] = df['2'].map(parseFloat)
    newFrame['low'] = df['3'].map(parseFloat)
    newFrame['close'] = df['4'].map(parseFloat)
    newFrame['volume'] = df['5'].map(parseFloat)
    newFrame['close_time'] = df['6']
    newFrame['sma'] = sma(newFrame['close'], 200)
    // console.log(newFrame)
    let prev = 0
    let prevd = 0
    let t = 1
    for (let i = 0; i < newFrame['sma'].length; i++) {
        let d = Object.keys(newFrame).map(key => newFrame[key][i])
        // console.log(d)
        if (t == 1) {
            prev = d[7]
            prevd = d[0]
            t = 7
        }
        context.beginPath()
        context.strokeStyle = '#ffbf00'
        context.lineWidth = 1.5
        context.setLineDash([0, 0])
        context.moveTo(xscale(prevd), yscale(prev))
        context.lineTo(xscale(d[0]), yscale(d[7]));
        prev = d[7]
        prevd = d[0]
        context.stroke();
    }

    // console.log(data)

    // line2(newFrame['sma'], context, xscale, yscale)
    // console.log(newFrame['sma'][0])

}

export function EMA(data, context, xscale, yscale) {
    const frame = Dataframe(data)
    frame.columns(['open_time', 'open', 'high', 'low', 'close', 'volume', 'close_time'])
    const df = frame.filter(['open_time', 'close'])
    df['close'] = df['close'].map(parseFloat)
    df['ema'] = ema(df['close'], 200)

    let prev = 0
    let prevd = 0
    let t = 1
    for (let i = 0; i < df['ema'].length; i++) {
        let d = Object.keys(df).map(key => +df[key][i])
        if (t == 1) {
            prev = d[2]
            prevd = d[0]
            t = 7
        }
        context.beginPath()
        context.strokeStyle = '#002aff'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevd), yscale(prev))
        context.lineTo(xscale(d[0]), yscale(d[2]));
        prev = d[2]
        prevd = d[0]
        context.stroke();
    }
}

export function WMA(data, context, xscale, yscale) {
    let prev = 0
    let prevd = 0
    let i = 1
    data.forEach(d => {
        if (i == 1) {
            prev = d[2]
            prevd = d[0]
            i = 2
        }
        context.beginPath()
        context.strokeStyle = '#b60f0f'
        context.lineWidth = 1.5
        context.setLineDash([])
        context.moveTo(xscale(prevd), yscale(prev))
        context.lineTo(xscale(d[0]), yscale(d[2]));
        prev = d[2]
        prevd = d[0]
        context.stroke();
    });
}



export function volume(data, context, xscale, yscale, xb, height){
    data.forEach(d => {
        context.fillStyle = (d[1] === d[4]) ? "silver" : (d[1] > d[4]) ? "#EF5350" : "#26A69A"
        context.beginPath()
        context.fillRect(xscale(d[0]) - xb.bandwidth() / 2,
            yscale(height) - yscale(d[5]),
            xb.bandwidth(),
            yscale(d[5])-yscale(height))
    })
}