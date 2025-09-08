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
    
    /**
    * 캔버스에서 투명과 불투명 영역 경계 좌표 추출
    * @returns {Array<{x:number, y:number}>} 경계 좌표 배열
    */
    static getEdgeCoordinates(ctx){
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const edgeCoords = [];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = (y * width + x) * 4;
                const alpha = data[i + 3];
                
                if (alpha > 0) {
                    // 상하좌우 픽셀 중 하나라도 alpha = 0이면 경계
                    const neighbors = [
                        ((y-1) * width + x) * 4 + 3,
                        ((y+1) * width + x) * 4 + 3,
                        (y * width + (x-1)) * 4 + 3,
                        (y * width + (x+1)) * 4 + 3
                    ];
                    
                    if (neighbors.some(n => data[n] === 0)) {
                        edgeCoords.push({ x, y });
                    }
                }
            }
        }
        return edgeCoords;
    }


    /**
   * 화면 안쪽 좌표인지 확인
   */
  static isInsideCanvas(x, y, width, height) {
    return x >= 0 && y >= 0 && x < width && y < height;
  }

  /**
   * Moore-Neighbor Tracing (외곽선 좌표 추적)
   * @param {Array<{x:number,y:number}>} coords - 경계 픽셀 좌표
   * @param {number} width - 캔버스 가로 크기
   * @param {number} height - 캔버스 세로 크기
   * @returns {Array<{x:number,y:number}>} 외곽선 좌표 (순서 정렬됨)
   */
  static traceBoundary(coords, width, height) {
    if (!coords.length) return [];

    const set = new Set(coords.map(p => `${p.x},${p.y}`));

    // 시작점: 화면 안쪽에서 y가 가장 작고, 같은 y면 x가 가장 작은 픽셀
    let start = coords
      .filter(p => this.isInsideCanvas(p.x, p.y, width, height))
      .reduce((a, b) =>
        (a.y < b.y || (a.y === b.y && a.x < b.x)) ? a : b
      );

    let boundary = [start];
    let current = { ...start };

    // 8방향 (시계 방향)
    const dirs = [
      {x:0,y:-1}, {x:1,y:-1}, {x:1,y:0}, {x:1,y:1},
      {x:0,y:1}, {x:-1,y:1}, {x:-1,y:0}, {x:-1,y:-1}
    ];

    // 시작 시, 탐색 방향은 "서쪽(왼쪽)"으로 설정
    let prevDir = 6; 

    let loopGuard = 0;
    do {
      let found = false;

      // 이전 방향의 왼쪽(반시계)부터 검사
      for (let i = 0; i < 8; i++) {
        let dir = (prevDir + i) % 8;
        let nx = current.x + dirs[dir].x;
        let ny = current.y + dirs[dir].y;

        if (!this.isInsideCanvas(nx, ny, width, height)) continue;

        if (set.has(`${nx},${ny}`)) {
          current = {x: nx, y: ny};
          boundary.push(current);

          // 새로운 prevDir = 현재 dir 기준으로 시계 반대 두 칸
          prevDir = (dir + 6) % 8; 
          found = true;
          break;
        }
      }

      if (!found) break;
      if (++loopGuard > 100000) break; // 안전장치
    } while (current.x !== start.x || current.y !== start.y);

    return boundary;
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



}