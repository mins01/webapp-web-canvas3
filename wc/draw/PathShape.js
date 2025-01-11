export default class PathShape{
  static line(ctx,x0,y0,x1,y1){
    ctx.moveTo(x0,y0)
    ctx.lineTo(x1,y1)
  }
  static lines(ctx,lines){
    if(lines.length < 2){ return }
    let i = 0;
    ctx.moveTo(lines[i][0],lines[i][1]);
    for(let i=1,m=lines.length;i<m;i++){
      ctx.lineTo(lines[i][0],lines[i][1])
    }
  }
  static arc(ctx,x, y, radius, startAngle=0, endAngle = null, counterclockwise = false){
    if(endAngle===null){endAngle = 2 * Math.PI;}
    ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise)
  }
  static circle(ctx,x, y, radius){
    this.arc(ctx,x, y, radius,0,2*Math.PI,false);
  }
  
  static rect(ctx,x, y, width, height){
    ctx.rect(x, y, width, height);
  }
  static roundRect(ctx,x, y, width, height, radii){
    ctx.roundRect(x, y, width, height, radii);
  }

  
  static equilateralPolygon(ctx, x, y, radius, points , startAngle = 0) {
    if (points < 3) return;  // 다각형의 변 개수는 최소 3이어야 합니다 (삼각형부터 시작)

    const angle = (2 * Math.PI) / points;  // 각 변의 각도 (360도를 n으로 나누기)
    
    // 첫 번째 꼭짓점 계산
    const startX = x + radius * Math.cos(startAngle);
    const startY = y + radius * Math.sin(startAngle);
    ctx.moveTo(startX, startY);  // 첫 번째 점으로 이동
    
    // 나머지 n-1개의 점 계산
    for (let i = 1; i < points; i++) {
      const currentX = x + radius * Math.cos(startAngle + i * angle);
      const currentY = y + radius * Math.sin(startAngle + i * angle);
      ctx.lineTo(currentX, currentY);  // 각 점을 이어서 그리기
    }
  }
  
  static star(ctx, x, y, radius, innerRadius , points=5 , startAngle = 0) {
    // const points = 5;  // 오망성은 5개의 점을 가짐
    const angle = Math.PI / points;  // 각 꼭짓점 사이의 각도 (360도/5 = 72도)
    
    // 첫 번째 꼭짓점 (오각형의 꼭짓점)
    let x1 = x + radius * Math.cos(startAngle);
    let y1 = y + radius * Math.sin(startAngle);
    ctx.moveTo(x1, y1);
    
    // 그 후 4개의 점과 안쪽 점을 연결하여 별을 그리기
    for (let i = 1; i < points * 2; i++) {
      const currentAngle = startAngle + i * angle;
      
      // 홀수 번째 점 (외부 꼭짓점)
      const currentRadius = i % 2 === 0 ? radius : innerRadius;
      
      const x2 = x + currentRadius * Math.cos(currentAngle);
      const y2 = y + currentRadius * Math.sin(currentAngle);
      
      ctx.lineTo(x2, y2);  // 점들을 이어서 그리기
    }
    
  }
}