export default class DrawLine{
    static draw(ctx,x0,y0,x,y){
        ctx.beginPath();
        ctx.moveTo(x0,y0 )
        ctx.lineTo(x,y)
        ctx.stroke()
        ctx.closePath();
    }

    /**
     * 
     * @param {*} ctx 
     * @param {Array} coordinates  [x0,y0,x1,y1,x2,y2...]
     */
    static drawByCoordinates(ctx,coordinates){
        console.log(ctx);
        
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