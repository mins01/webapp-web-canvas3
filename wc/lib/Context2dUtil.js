export default class Context2dUtil{

    /**
     * Description placeholder
     *
     * @static
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} [minAlpha=1] 최소 alpha
     */
    static toFullOpaque(ctx,minAlpha=1){
        const c = ctx.canvas
        const imageData = ctx.getImageData(0,0,c.width,c.height);      
        for(let i=0,m=imageData.data.length;i<m;i+=4){
            if(imageData.data[i+3]===0){ continue; }
            console.log(i+3,imageData.data[i+3]);
            imageData.data[i+3] = imageData.data[i+3] < minAlpha?0:255;
        }
        ctx.putImageData(imageData,0,0);
    }

    /**
     * Description placeholder
     *
     * @static
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} r red
     * @param {number} g green
     * @param {number} b blue
     * @param {number} [a=255] alpha
     * @param {number} [minAlpha=1] 
     */
    static flattenOpacity(ctx,r,g,b,a=255,minAlpha=1){
        const c = ctx.canvas
        const imageData = ctx.getImageData(0,0,c.width,c.height);      
        for(let i=0,m=imageData.data.length;i<m;i+=4){
            if(imageData.data[i+3]===0){ continue; }

            imageData.data[i+0] = r;
            imageData.data[i+1] = g;
            imageData.data[i+2] = b;
            imageData.data[i+3] = imageData.data[i+3] < minAlpha?0:a;
        }
        ctx.putImageData(imageData,0,0);
    }

    
    /**
     * Description placeholder
     *
     * @static
     * @param {string} url url or dataUrl
     * @returns {*} 
     */
    static imageFromUrl(url){
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload=function(event){ resolve(this); }
            img.onerror=function(event){ reject(event); }
            img.src = url;
        });
    }
}