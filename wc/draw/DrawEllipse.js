export default class DrawEllipse{
    static draw(ctx,x,y,w,h,rotation,option={}){
        option = Object.assign({ 
            'fillAfterStroke':(option.fillAfterStroke??ctx.fillAfterStroke??true), 
            'disableFill':(option.disableFill??ctx.disableFill??false), 
            'disableStroke':(option.disableStroke??ctx.disableStroke??false), 
            'strokeLocation':(option.strokeLocation??ctx.strokeLocation??'inside'), // inside, outside, center 
        },option)
        
        const lw = ctx.lineWidth;

        let fx = x+w/2,fy=y+h/2, fw=w, fh=h;
        let sx = x+w/2,sy=y+h/2, sw=w, sh=h;
        if(option.strokeLocation=='inside'){
            sw = Math.max(1,w-lw); sh = Math.max(1,h-lw);
        }


        if(option.fillAfterStroke??true){ 
            if(!option.disableFill){
                ctx.beginPath();
                ctx.ellipse(fx, fy, fw/2, fh/2, rotation , 0, 2 * Math.PI);
                ctx.fill(); 
                ctx.closePath();
            }
                
            if(!option.disableStroke){
                ctx.beginPath();
                ctx.ellipse(sx, sy, sw/2, sh/2, rotation , 0, 2 * Math.PI);
                ctx.stroke(); 
                ctx.closePath();
            }
        }else{ 
            if(!option.disableStroke){
                ctx.beginPath();
                ctx.ellipse(sx, sy, sw/2, sh/2, rotation , 0, 2 * Math.PI);
                ctx.stroke(); 
                ctx.closePath();
            }
            if(!option.disableFill){
                ctx.beginPath();
                ctx.ellipse(fx, fy, fw/2, fh/2, rotation , 0, 2 * Math.PI);
                ctx.fill(); 
                ctx.closePath();
            }
        }
    }
}