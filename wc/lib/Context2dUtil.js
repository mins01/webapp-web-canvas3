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
    



    /*
    우선 이거 포기 중. 사용금지.
    opencv 필수
     */
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


    /**
     * 캔버스를 특정 기준(type)에 따라 잘라냅니다.
     * 
     * @param {CanvasRenderingContext2D} ctx - 캔버스의 2D 렌더링 컨텍스트
     * @param {'transparent'} [type='transparent'] - 잘라낼 기준 ('transparent'만 지원)
     * @throws {Error} 지원하지 않는 type일 경우 에러 발생
     * @returns {void}
     */
    static trim(ctx,color='transparent'){
        if(color==='transparent'){
            const rect = this.getTrimBoundingBox(ctx,[null,null,null,0]);
            if(rect){ return this.crop(ctx,rect); }
            return null;
        }else if(color==='white'){
            const rect = this.getTrimBoundingBox(ctx,[255,255,255,null]);
            if(rect){ return this.crop(ctx,rect); }
            return null;
        }else if(color==='black'){
            const rect = this.getTrimBoundingBox(ctx,[0,0,0,null]);
            if(rect){ return this.crop(ctx,rect); }
            return null;
        }else if(Array.isArray(color)){
            const rect = this.getTrimBoundingBox(ctx,color);
            if(rect){ return this.crop(ctx,rect); }
            return null;
        }
        throw Error('wrong color');
    }
    /**
     * 캔버스를 특정 기준(type)에 따라 잘라냅니다.
     * 
     * @param {CanvasRenderingContext2D} ctx - 캔버스의 2D 렌더링 컨텍스트
     * @param {'transparent'} [type='transparent'] - 잘라낼 기준 ('transparent'만 지원)
     * @throws {Error} 지원하지 않는 type일 경우 에러 발생
     * @returns {void}
     */
    static selfTrim(ctx,color='transparent'){
        if(color==='transparent'){
            const rect = this.getTrimBoundingBox(ctx,[null,null,null,0]);
            if(rect){ return this.selfCrop(ctx,rect); }
            return null;
        }else if(color==='white'){
            const rect = this.getTrimBoundingBox(ctx,[255,255,255,null]);
            if(rect){ return this.selfCrop(ctx,rect); }
            return null;
        }else if(color==='black'){
            const rect = this.getTrimBoundingBox(ctx,[0,0,0,null]);
            if(rect){ return this.selfCrop(ctx,rect); }
            return null;
        }else if(Array.isArray(color)){
            const rect = this.getTrimBoundingBox(ctx,color);
            if(rect){ return this.selfCrop(ctx,rect); }
            return null;
        }
        throw Error('wrong color');
    }

    /**
     * 지정된 영역(rect)만 남기고 캔버스를 잘라냅니다.
     * 
     * @param {CanvasRenderingContext2D} ctx - 원본 캔버스 컨텍스트
     * @param {{x: number, y: number, width: number, height: number}} rect - 잘라낼 사각형 영역
     * @returns {CanvasRenderingContext2D}
     */
    static crop(ctx,rect){
        const { x, y, width, height } = rect;
        // const newCanvas = globalThis.document.createElement('canvas');
        const newCanvas = ctx.canvas.cloneNode(true);
        newCanvas.width = width;
        newCanvas.height = height;
        const newCtx = newCanvas.getContext('2d')
        const imageData = ctx.getImageData(x, y, width, height);
        newCtx.putImageData(imageData,0,0);
        return newCanvas;
    }
    
    /**
     * 지정된 영역(rect)만 남기고 캔버스를 잘라냅니다.
     * 
     * @param {CanvasRenderingContext2D} ctx - 원본 캔버스 컨텍스트
     * @param {{x: number, y: number, width: number, height: number}} rect - 잘라낼 사각형 영역
     * @returns {void}
     */
    static selfCrop(ctx,rect){
        const { x, y, width, height } = rect;
        const imageData = ctx.getImageData(x, y, width, height);
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        const newCtx = ctx.canvas.getContext('2d')
        newCtx.putImageData(imageData,0,0);
        return ;
    }

    /**
     * 캔버스에서 특정 RGBA 색상에 해당하는 픽셀 영역의 최소 바운딩 박스 계산
     * 배경색으로 지정된 RGBA 픽셀은 제외하고, 나머지 영역만 바운딩 박스로 잡습니다.
     * 
     * @param {CanvasRenderingContext2D} ctx - 캔버스 2D 렌더링 컨텍스트
     * @param {number[]} [excludeRgba=[null, null, null, 0]] - trim 될 기준 색상 [r, g, b, a] (0~255)
     * @param {Object} [options={}] - 추가 옵션
     * @param {number} [options.tolerance=0] - 색상 허용 오차 (0~255)
     * @param {number} [options.sample=1] - 샘플링 간격 (성능/정확도 조절)
     * @returns {{x:number, y:number, width:number, height:number} | null} - 잘라낼 영역 사각형 또는 null
     * @throws {TypeError} 유효하지 않은 ctx가 전달된 경우
     */
    static getTrimBoundingBox(ctx, excludeRgba = [null, null, null, 0], options = {}) {
        if (!ctx || typeof ctx.getImageData !== 'function') {
            throw new TypeError('유효한 CanvasRenderingContext2D를 전달하세요.');
        }

        const { tolerance = 0, sample = 1 } = options;

        // excludeRgba가 배열이 아닌 경우 기본값으로 보정
        if (!Array.isArray(excludeRgba) || excludeRgba.length !== 4) {
            excludeRgba = [null, null, null, 0];
        }

        const canvas = ctx.canvas;
        const w = canvas.width;
        const h = canvas.height;
        if (w === 0 || h === 0) return null;

        let img;
        try {
            img = ctx.getImageData(0, 0, w, h);
        } catch (e) {
            throw new Error('getImageData를 호출할 수 없습니다. (CORS 제약일 수 있음)');
        }

        const data = img.data;
        let minX = w, minY = h, maxX = -1, maxY = -1;

        const matchesRgba = (rgbaData,pixelData,tolerance)=>{
            if(rgbaData[0]!==null && Math.abs(pixelData[0] - rgbaData[0]) > tolerance){ return false; }
            if(rgbaData[1]!==null && Math.abs(pixelData[1] - rgbaData[1]) > tolerance){ return false; }
            if(rgbaData[2]!==null && Math.abs(pixelData[2] - rgbaData[2]) > tolerance){ return false; }
            if(rgbaData[3]!==null && Math.abs(pixelData[3] - rgbaData[3]) > tolerance){ return false; }
            return true;
        }

        for (let y = 0; y < h; y += sample) {
            let rowOffset = y * w * 4;
            for (let x = 0; x < w; x += sample) {
                const idx = rowOffset + x * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const a = data[idx + 3];

                // 배경색 제외: RGBA 모두 tolerance 이하이면 건너뜀
                if (!matchesRgba(excludeRgba,[r,g,b,a],tolerance)) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX === -1) return null; // 일치하는 픽셀 없음

        // 샘플링 보정
        if (sample > 1) {
            minX = Math.max(0, minX - (sample - 1));
            minY = Math.max(0, minY - (sample - 1));
            maxX = Math.min(w - 1, maxX + (sample - 1));
            maxY = Math.min(h - 1, maxY + (sample - 1));
        }

        const x = minX;
        const y = minY;
        const width = maxX - minX + 1;
        const height = maxY - minY + 1;

        return { x, y, width, height };
    }
}