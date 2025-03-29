export default class BaseTool {

	pointerType = null; // mouse, pen , touch
	downAt = null
	name = null;
	editor = null;
	peh = null;
	document = null;
	documentRect = null;
	layer = null;
	drawLayer = null;
	x0 = null;
	y0 = null;
	// x = null;
	// y = null;
	x1 = null;
	y1 = null;
	enable = true; //툴 사용가능 상태
	
	constructor(editor){
		this.editor = editor;
		this.name = 'BaseTool';

		this.init();
	}

	init(){
		console.log('BaseTool::init()');
		
		this.peh = this.editor.peh

		this.pointerType = null
		this.downAt = null;

		this.document = this.editor?.document;
		this.layer = this?.document?.layer;
		this.drawLayer = this?.document?.drawLayer;
		// if(this.document) this.ready()

		this.x0 = null;
		this.y0 = null;
		this.x1 = null;
		this.y1 = null;
	}

	/** 
	 * 활성화 : 툴이 선택 되면
	 */
	activate(cb=null){
		this.init();
		this.ready();
		if(cb){ cb(); }
		this?.document?.flush();
		this.editor.dispatchEvent('wc.tool.activate', { toolName:this.name, tool:this } );
		console.log('tool-activate:',this.name);
	}

	/** 
	 * 비활성화 : 다른 툴이 활성화 되면
	 */
	inactivate(cb=null){
		if(cb){ cb(); }
		this.editor.dispatchEvent('wc.tool.inactivate', { toolName:this.name, tool:this } );
		console.log('tool-inactivate',this.name);

	}

	/** 추가적인 확정 동작이 필요할 경우 호출 */
	confirm(cb=null){
		if(cb){ cb(); }
		this.editor.dispatchEvent('wc.tool.confirm', { toolName:this.name, tool:this } );
		console.log('tool-confirm',this.name);
	}

	/** 동작 취소가 필요할 경우 호출. 초기화 시킨다. */
	cancel(cb=null){
		if(cb){ cb(); }
		this.downAt = null;
		this.editor.dispatchEvent('wc.tool.cancel', { toolName:this.name, tool:this } );
		console.log('tool-cancel',this.name);
	}








	/**
	 * 툴을 사용할 수 있도록 준비 시킴.
	 */
	ready(){
		this.documentRect = this?.document?.getBoundingClientRect(); // 캐싱용 위치 정보. 매번 불리면 느려진다.
		this?.document?.readyTool()
	}









	/** 이벤트 처리 시작 */
	start(){
	}

	onpointerdown(event){
		this.pointerType = event.pointerType??null;
		if(!this.downAt) this.downAt = Date.now();
		if(!this.downAt) return false;
	}

	onpointermove(event){
		if(!this.downAt) return false;
	}

	onpointerup(event){
		if(!this.downAt) return false;
	}

	
	/**
	 * 이벤트 처리에 대한 최종 종료
	 *
	 * @returns {boolean} 정상종료시 true, 아니면 false
	 */
	end(){
		if(this.downAt){ this.downAt = null; return true }
		return false;
	}

	
	draw(){

	}



	/**
	 * x,y in viewport from event
	 *
	 * @param {*} event 
	 * @returns {{}} 
	 */
	getXyFromEvent(event){
		let x = event.x + window.scrollX;
		let y = event.y + window.scrollY;
		return [x,y];
	}

	// 아무 scrollbar 및 postion relative와 absolute 가 없을 경우, 그리고 transform: translate()  rotate() scale()
	/**
	 * 좌표 x,y 에 대해서 document 속의 x,y로 변경한다. zoom 영향을 무시해서 계산한다. 회전에 대해서는 getXYForLayer 에서 처리한다.
	 *
	 * @param {number} inX 
	 * @param {number} inY 
	 * @returns {[number,number]} 
	 */
	getXyInDocument(inX,inY){
		const doc = this.document;
		const docRect = this.documentRect;
		const zoom = doc.zoom;

		let docCenterX = (docRect.right + docRect.left) / 2
		let docCenterY = (docRect.bottom + docRect.top) / 2
		// let left = docCenterX - docParnet.offsetWidth/2;
		// let top =docCenterY - docParnet.offsetHeight/2;
		
		let x = inX;
		let y = inY;
		
		[x,y] = this.rotatePoint(x, y, doc.width/2, doc.height/2, -doc.angle)

		x = inX - (docCenterX - doc.width*zoom/2);
		y = inY - (docCenterY - doc.height*zoom/2);	
		
		

		if(zoom!==1){
			x /= zoom;
			y /= zoom;
		}
		return [x,y];
	}
	getDocumentXyFromPageXy(inX,inY){
		return this.getXyInDocument(inX,inY);
	}

	getPageXyFromDocumentXy(inX,inY){
		const doc = this.document;
		const docRect = this.documentRect;
		const zoom = doc.zoom;

		let docCenterX = (docRect.right + docRect.left) / 2
		let docCenterY = (docRect.bottom + docRect.top) / 2
		
		let x = inX;
		let y = inY;

		if(zoom!==1){
			x *= zoom;
			y *= zoom;
		}
		
		// [x,y] = this.rotatePoint(x, y, doc.width/2, doc.height/2, doc.angle)

		x = (docCenterX - doc.width/2*zoom) + x;
		y = (docCenterY - doc.height/2*zoom) + y;

		[x,y] = this.rotatePoint(x, y, docCenterX, docCenterY, doc.angle)

	
		return [x,y];
	}


	rotatePoint(x, y, cx, cy, angleDegrees) {
    const angleRadians = (Math.PI / 180) * angleDegrees; // 각도를 라디안으로 변환

    // 원점을 중심으로 좌표 이동
    const xShifted = x - cx;
    const yShifted = y - cy;

    // 회전 변환
    const xRotated = xShifted * Math.cos(angleRadians) - yShifted * Math.sin(angleRadians);
    const yRotated = xShifted * Math.sin(angleRadians) + yShifted * Math.cos(angleRadians);

    // 원래 위치로 복귀
    const xNew = xRotated + cx;
    const yNew = yRotated + cy;

    // return { x: xNew, y: yNew };
    return [xNew,yNew]
}

	//  scrollbar 및 postion relative와 absolute 가 있을 경우, 그리고 zoom 사용
	// getXyInDocument(inX,inY){
	// 	const doc = this.document;
	// 	const zoom = doc.zoom;
	// 	let x = inX - (doc.offsetLeft * zoom + doc.frame.offsetLeft + doc.frame.parentElement.offsetLeft - doc.frame.scrollLeft);
	// 	let y = inY - (doc.offsetTop * zoom + doc.frame.offsetTop + doc.frame.parentElement.offsetTop - doc.frame.scrollTop);

	// 	if(zoom!==1){
	// 		x = x/zoom;
	// 		y = y/zoom;
	// 	}
	// 	return [x,y];
	// }


	getXyInLayer(inX,inY){
		return [inX,inY]
	}

	
	/**
	 * Description placeholder
	 *
	 * @param {*} event 
	 * @returns {{}} 
	 * @deprecated
	 */
	getXYForLayer(event){
		const doc = this.document;
		const docRect = this.documentRect;
		const layer = this.document.layer;
		

		let x = event.x - doc.offsetLeft - layer.left + window.scrollX;
		let y = event.y - doc.offsetTop - layer.top + window.scrollY;

		const docZoom = parseFloat(doc.zoom);
		if(docZoom!==1){
			x += doc.width/2*(docZoom-1);
			y += doc.height/2*(docZoom-1);
			x = x/docZoom;
			y = y/docZoom;
		}

		const layerZoom = parseFloat(layer.zoom);
		if(layerZoom!==1){
			x += layer.width/2*(layerZoom-1);
			y += layer.height/2*(layerZoom-1);
			x = x/layerZoom;
			y = y/layerZoom;
		}
		return [x,y];
	}

	/**
	 * layer 에 그릴 때 위치 조정 등을 준비한다.
	 *
	 * @param {*} ctx 
	 */
	prepareLayer(ctx){		
		const doc = this.document;
		const layer = this.document.layer;	


		// layer.angle 적용
		ctx.translate(layer.width / 2,layer.height / 2);
		if(layer.angle !== 0){ ctx.rotate(-layer.angle * (Math.PI / 180)); }
		ctx.scale(layer.flipX,layer.flipY);
		ctx.translate(-layer.width / 2,-layer.height / 2);
		// console.log('layer.angle',layer.angle);
		
		// layer 적용 크기 변경
		ctx.scale(1/layer.zoom,1/layer.zoom)

		// // doc.angle 적용
		if(doc.angle !== 0){
			ctx.translate(doc.width / 2 - layer.left ,doc.height / 2 - layer.top);
			ctx.rotate(-doc.angle * (Math.PI / 180));
			ctx.translate(-(doc.width / 2 - layer.left) ,-(doc.height / 2 - layer.top));
		}

		// 좌표 오차 변경		
		ctx.translate(-layer.left,-layer.top);
	}
}