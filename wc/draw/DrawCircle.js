export default class DrawCircle{
    static draw(ctx,x,y,r,option={}){
        option = Object.assign({ 
            'fillAfterStroke':(option.fillAfterStroke??ctx.fillAfterStroke??true), 
            'disableFill':(option.disableFill??ctx.disableFill??false), 
            'disableStroke':(option.disableStroke??ctx.disableStroke??false), 
            'strokeLocation':(option.strokeLocation??ctx.strokeLocation??'inside'), // inside, outside, center 
        },option)
        
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