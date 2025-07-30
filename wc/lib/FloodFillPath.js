class FloodFillPath{
    static colorDistanceRGBA(c1, c2) {
        return Math.hypot(
            c1[0] - c2[0], // R
            c1[1] - c2[1], // G
            c1[2] - c2[2], // B
            c1[3] - c2[3]  // A
        );
    }

    /**
     * 캔버스 컨텍스트에서 시작점 (startX, startY) 기준으로
     * RGBA 색상 거리가 지정한 허용 범위(tolerance) 이내인
     * 인접 픽셀 영역을 Flood Fill 방식으로 찾습니다.
     *
     * 색상 거리는 R, G, B, A 채널 모두를 포함하며,
     * 거리가 tolerance 이하인 픽셀들을 같은 영역으로 판단합니다.
     *
     * @param {CanvasRenderingContext2D} ctx - 2D 캔버스 렌더링 컨텍스트
     * @param {number} startX - 캔버스 기준 시작 x 좌표
     * @param {number} startY - 캔버스 기준 시작 y 좌표
     * @param {number} [tolerance=30] - 색상 거리 허용 범위 (0~510)
     *   기본값 30은 적당히 비슷한 색상을 포함하는 범위입니다.
     * 5 ~ 15	거의 동일한 색상
     * 20 ~ 50	눈에 띄게 비슷한 색상
     * 60 ~ 100	넓은 범위, 색상 군집 포함
     * 100 이상	매우 넓은 범위
     * @returns {Path2D} 유사한 색상으로 연결된 영역을 표현하는 Path2D 객체
     */
    static floodFillWithAlpha(ctx, startX, startY, tolerance = 30) {
        const { width, height } = ctx.canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        const getIndex = (x, y) => (y * width + x) * 4;
        const visited = new Uint8Array(width * height);
        const queue = [[startX, startY]];
        
        const startIdx = getIndex(startX, startY);
        const baseColor = [
            data[startIdx],     // R
            data[startIdx + 1], // G
            data[startIdx + 2], // B
            data[startIdx + 3]  // A
        ];
        
        const path = new Path2D();
        
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            
            const pos = y * width + x;
            if (visited[pos]) continue;
            
            const idx = getIndex(x, y);
            const color = [
                data[idx],     // R
                data[idx + 1], // G
                data[idx + 2], // B
                data[idx + 3]  // A
            ];
            
            const distance = this.colorDistanceRGBA(baseColor, color);
            
            if (distance <= tolerance) {
                visited[pos] = 1;
                path.rect(x, y, 1, 1); // 해당 픽셀을 path에 포함
                
                // 4방향 탐색
                queue.push([x + 1, y]);
                queue.push([x - 1, y]);
                queue.push([x, y + 1]);
                queue.push([x, y - 1]);
            }
        }

        return path;
    }
}

export default FloodFillPath;