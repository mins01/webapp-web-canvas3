export default class DrawRectangle{
    static draw(ctx,x,y,w,h,option={}){
        option = Object.assign({ 'fillAfterStroke':(ctx.fillAfterStroke??true), 'disableFill':(ctx.disableFill??false), 'disableStroke':(ctx.disableStroke??false), },option)
        
        ctx.beginPath();
        ctx.rect(x, y, w, h);        
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