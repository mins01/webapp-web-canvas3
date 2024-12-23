export default class DrawLine{
    static draw(ctx,x0,y0,x,y){
        ctx.beginPath();
        ctx.moveTo(x0,y0 )
        ctx.lineTo(x,y)
        ctx.stroke()
        ctx.closePath();
    }
}