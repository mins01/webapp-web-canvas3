export default class DrawLine{

    /**
     * 두 점으로 선을 그린다.
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x0 
     * @param {number} y0 
     * @param {number} x 
     * @param {number} y 
     */
    static draw(ctx,x0,y0,x,y){
        ctx.beginPath();
        ctx.moveTo(x0,y0 )
        ctx.lineTo(x,y)
        ctx.stroke()
        ctx.closePath();
    }

    /**
     * 연속된 좌표로 연속된 선을 그린다.
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Array<number>} coordinates  [x0,y0,x1,y1,x2,y2...]
     */
    static drawByCoordinates(ctx,coordinates){       
        if(!coordinates || !coordinates.length){ return false; }
        ctx.beginPath();
        ctx.moveTo(coordinates[0],coordinates[1])
        for(let i=2,m=coordinates.length;i<m;i+=2){
            ctx.lineTo(coordinates[i],coordinates[i+1])
        }
        ctx.stroke()
        ctx.closePath();
    }

}