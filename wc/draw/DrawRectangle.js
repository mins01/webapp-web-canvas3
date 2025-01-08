export default class DrawRectangle{
    static draw(ctx,x,y,w,h,option={}){
        option = Object.assign({ 
            'fillAfterStroke':(ctx.fillAfterStroke??true), 
            'disableFill':(ctx.disableFill??false), 
            'disableStroke':(ctx.disableStroke??false), 
            'strokeLocation':(ctx.strokeLocation??'inside'), // inside, outside, center 
        },option)
        
        const lw = ctx.lineWidth;

        let fx = x,fy=y, fw=w, fh=h;
        let sx = x,sy=y, sw=w, sh=h;
        if(option.strokeLocation=='inside'){
            sx = x+lw/2; sy = y+lw/2;
            sw = w-lw; sh = h-lw;
        }


        if(option.fillAfterStroke??true){ 
            if(!option.disableFill){
                ctx.beginPath();
                ctx.rect(fx, fy, fw, fh);
                ctx.fill(); 
                ctx.closePath();
            }
                
            if(!option.disableStroke){
                ctx.beginPath();
                ctx.rect(sx, sy, sw, sh);
                ctx.stroke(); 
                ctx.closePath();
            }
        }else{ 
            if(!option.disableStroke){
                ctx.beginPath();
                ctx.rect(sx, sy, sw, sh);
                ctx.stroke(); 
                ctx.closePath();
            }
            if(!option.disableFill){
                ctx.beginPath();
                ctx.rect(fx, fy, fw, fh);
                ctx.fill(); 
                ctx.closePath();
            }
        }
    }
}