export default class ShapePath2D{
  static line(x0,y0,x1,y1){
    const path2d = new Path2D();
    path2d.moveTo(x0,y0)
    path2d.lineTo(x1,y1)
    return path2d;
  }
  
  static lines(lines){
    if(lines.length < 2){ return null}
    const path2d = new Path2D();
    let i = 0;
    path2d.moveTo(lines[i][0],lines[i][1]);
    for(let i=1,m=lines.length;i<m;i++){
      path2d.lineTo(lines[i][0],lines[i][1])
    }
    return path2d;
  }

  static arc(x, y, radius, startAngle=0, endAngle = null, counterclockwise = false){
    const path2d = new Path2D();
    if(endAngle===null){endAngle = 2 * Math.PI;}
    path2d.arc(x, y, radius, startAngle, endAngle, counterclockwise)
    return path2d;
  }

  static circle(x, y, radius){
    return this.arc(x, y, radius,0,2*Math.PI,false);
  }

  static rect(x, y, width, height){
    const path2d = new Path2D();
    path2d.rect(x, y, width, height);
    return path2d;
  }
  static square(x, y, width){
    return this.rect(x, y, width, width);
  }
  static roundRect(x, y, width, height, radii){
    const path2d = new Path2D();
    path2d.roundRect(x, y, width, height, radii);
    return path2d;
  }
}