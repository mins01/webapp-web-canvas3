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
        // console.log('a',a,'minAlpha',minAlpha);
        
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
    
    
    // /**
    //  * Description placeholder
    //  *
    //  * @static
    //  * @param {string} url url or dataUrl
    //  * @returns {*} 
    //  */
    // static imageFromUrl(url){
    //     return new Promise((resolve, reject) => {
        //         const img = new Image();
    //         img.onload=function(event){ resolve(event.target); }
    //         img.onerror=function(event){ reject(event); }
    //         img.src = url;
    //     });
    // }
    




    static async  getOrderedContour(canvas) {
        return new Promise((resolve, reject) => {
            // OpenCV.js 로딩 확인
            const run = () => {
                try {
                    // Canvas → cv.Mat
                    let img = cv.imread(canvas); // RGBA
                    let gray = new cv.Mat();
                    cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

                    // Threshold: 투명 vs 불투명
                    let thresh = new cv.Mat();
                    cv.threshold(gray, thresh, 1, 255, cv.THRESH_BINARY);

                    // 윤곽선 찾기 (외곽만)
                    let contours = new cv.MatVector();
                    let hierarchy = new cv.Mat();
                    cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

                    let points = [];
                    if (contours.size() > 0) {
                        // 첫 번째 외곽선만 사용
                        const contour = contours.get(0);
                        for (let i = 0; i < contour.data32S.length; i += 2) {
                            points.push({ x: contour.data32S[i], y: contour.data32S[i + 1] });
                        }
                    }

                    // 메모리 해제
                    img.delete(); gray.delete(); thresh.delete(); contours.delete(); hierarchy.delete();

                    resolve(points);
                } catch (err) {
                    reject(err);
                }
            };

            if (cv.getBuildInformation) run();
            else cv['onRuntimeInitialized'] = run;
        });
    }

    // 좌표를 폐쇄경로로 변환
    static coordinatesToClosedPath2D(coords){
        const path2D = new Path2D();
        if(!(coords?.length)){return null; }
        path2D.moveTo(coords[0].x,coords[0].y);
        console.log(coords[0].x,coords[0].y);
        
        for(let i=1,m=coords.length;i<m;i++){
            path2D.lineTo(coords[i].x,coords[i].y);
        }
        path2D.closePath()
        return path2D;
    }

    // context2d 가 비어있는가?
    static isEmpty(ctx) {
        const { width, height } = ctx.canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const buffer = new Uint32Array(imageData.data.buffer);

        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] !== 0){
                return false; // 픽셀이 하나라도 있으면 false
            }
        }
        return true; // 모두 0이면 완전 투명
    }
}