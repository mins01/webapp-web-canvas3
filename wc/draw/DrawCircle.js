export default class DrawCircle{
    static draw(ctx,x,y,r,option={}){
        option = Object.assign({ 'fillAfterStroke':(ctx.fillAfterStroke??true), 'disableFill':(ctx.disableFill??false), 'disableStroke':(ctx.disableStroke??false), },option)
        
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        if(option.fillAfterStroke??true){ 
            if(!option.disableFill) ctx.fill(); 
            if(!option.disableStroke) ctx.stroke(); 
        }else{ 
            if(!option.disableStroke) ctx.stroke(); 
            if(!option.disableFill) ctx.fill(); 
        }
        ctx.closePath();
    }
}