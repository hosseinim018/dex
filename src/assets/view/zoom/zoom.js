import * as d3 from "d3";

export function Zoom(width, height, margin, xaxis, yaxis, xscale, yscale, xb, callback) {
    // z holds a copy of the previous transform, so we can track its changes
    let z = d3.zoomIdentity;
    // The zoom.scaleExtent() Function in D3.js is used to set the scale extends to the specified array of numbers [k0, k1].
    // The k0 is the minimum allowed scale factor and k1 is the maximum allowed scale factor
    const zoomX = d3.zoom();
    const zoomY = d3.zoom();
    // The d3.zoomTransform() Function in D3.js is used to get the current transform for the specified node.
    // d3.zoomTransform(node)
    // Object { k: 1, x: 0, y: 0 }
    const tx = () => d3.zoomTransform(xaxis.node());
    const ty = () => d3.zoomTransform(yaxis.node());

    xaxis.call(zoomX).attr("pointer-events", "none");
    yaxis.call(zoomY).attr("pointer-events", "none");

    function center(event, target) {
        if (event.sourceEvent) {
            const p = d3.pointers(event, target);
            return [d3.mean(p, d => d[0]), d3.mean(p, d => d[1])];
        }
        return [width / 2, height / 2];
    }

    Zoom.mainPlot = (e) => {
        const t = e.transform;
        const k = t.k / z.k;
        const point = center(e, this);
        const shift = e.sourceEvent && e.sourceEvent.shiftKey;

        if (k === 1) {
            // print('paning')
            xaxis.call(zoomX.translateBy, (t.x - z.x) / tx().k, 0);
            yaxis.call(zoomY.translateBy, 0, (t.y - z.y) / ty().k);

        } else {
            // print('zooming')
            xaxis.call(zoomX.scaleBy, shift ? 1 / k : k, point);
            yaxis.call(zoomY.scaleBy, k, point);
            xb.range([0, width - margin.right].map(d => tx().applyX(d)));
        }
        z = t

        const xr = tx().rescaleX(xscale);
        const yr = ty().rescaleY(yscale);
        callback(xr, yr, e)
    }

    Zoom.axisPlot = (e) => {
        const xr = tx().rescaleX(xscale);
        const yr = ty().rescaleY(yscale);
        xb.range([0, width - margin.right].map(d => tx().applyX(d)));
        callback(xr, yr, e)
    }

    return Zoom
}

