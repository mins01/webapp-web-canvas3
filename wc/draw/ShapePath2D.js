export default class ShapePath2D{
  static line(x0,y0,x1,y1){
    const path2d = new Path2D();
    path2d.moveTo(x0,y0)
    path2d.lineTo(x1,y1)
    // path2d.closePath(); // line에서는 close 안한다.
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
    // path2d.closePath(); // line에서는 close 안한다.
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
  static roundSquare(x, y, width, radii){
    return this.roundRect(x, y, width, width, radii);
  }


  static equilateralPolygon(x, y, radius, points , startAngle = 0) {
    if (points < 3) return null;  // 다각형의 변 개수는 최소 3이어야 합니다 (삼각형부터 시작)
    const path2d = new Path2D();

    const angle = (2 * Math.PI) / points;  // 각 변의 각도 (360도를 n으로 나누기)
    
    // 첫 번째 꼭짓점 계산
    const startX = x + radius * Math.cos(startAngle);
    const startY = y + radius * Math.sin(startAngle);
    path2d.moveTo(startX, startY);  // 첫 번째 점으로 이동
    
    // 나머지 n-1개의 점 계산
    for (let i = 1; i < points; i++) {
      const currentX = x + radius * Math.cos(startAngle + i * angle);
      const currentY = y + radius * Math.sin(startAngle + i * angle);
      path2d.lineTo(currentX, currentY);  // 각 점을 이어서 그리기
    }
    path2d.closePath();
    
    return path2d;
  }

  static star(x, y, radius, innerRadius , points=5 , startAngle = 0) {
    const path2d = new Path2D();

    const angle = Math.PI / points;  // 각 꼭짓점 사이의 각도 (360도/5 = 72도)
    
    // 첫 번째 꼭짓점 (오각형의 꼭짓점)
    let x1 = x + radius * Math.cos(startAngle);
    let y1 = y + radius * Math.sin(startAngle);
    path2d.moveTo(x1, y1);
    
    // 그 후 4개의 점과 안쪽 점을 연결하여 별을 그리기
    for (let i = 1; i < points * 2; i++) {
      const currentAngle = startAngle + i * angle;
      
      // 홀수 번째 점 (외부 꼭짓점)
      const currentRadius = i % 2 === 0 ? radius : innerRadius;
      
      const x2 = x + currentRadius * Math.cos(currentAngle);
      const y2 = y + currentRadius * Math.sin(currentAngle);
      
      path2d.lineTo(x2, y2);  // 점들을 이어서 그리기
    }
    path2d.closePath();
    return path2d;
    
  }

  static merge(...paths) {
    const merged = new Path2D();
    paths.forEach(p => merged.addPath(p));
    return merged;
  }
}