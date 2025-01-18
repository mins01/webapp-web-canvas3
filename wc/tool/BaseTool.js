export default class BaseTool {

	name = null;
	editor = null;
	document = null;
	layer = null;
	drawLayer = null;
	x0 = null;
	y0 = null;
	// x = null;
	// y = null;
	x1 = null;
	y1 = null;

	constructor(editor){
		this.name = 'BaseTool';
		this.editor = editor;

		this.document = null;
		this.layer = null;
		this.drawLayer = null;

		this.x0 = null;
		this.y0 = null;
		// this.x = null;
		// this.y = null;
		this.x1 = null;
		this.y1 = null;
	}

	init(){
		this.document = this.editor.document??null;
		this.layer = this.document.layer??null;
		this.drawLayer = this.document.drawLayer??null;
		if(this.document) this.document.ready()

		this.x0 = null;
		this.y0 = null;
		// this.x = null;
		// this.y = null;
		this.x1 = null;
		this.y1 = null;

	}
	start(){
		this.init();
	}

	onpointerdown(event){

	}

	onpointermove(event){

	}

	onpointerup(event){

	}

	end(){

	}

	input(){

	}
	apply(){
		this.layer.merge(this.drawLayer)
		this.drawLayer.clear();
		this.document.apply();
	}


	sync(){

	}
	draw(){

	}

	getXyFromEvent(event){
		let x = event.x + window.scrollX;
		let y = event.y + window.scrollY;
		return [x,y];
	}

	// 아무 scrollbar 및 postion relative와 absolute 가 없을 경우, 그리고 transform scale 사용
	// getXyInDocument(inX,inY){
	// 	const doc = this.document;
	// 	let x = inX - doc.offsetLeft;
	// 	let y = inY - doc.offsetTop;
	// 	const zoom = doc.zoom;
	// 	if(zoom!==1){
	// 		x += doc.width/2*(zoom-1);
	// 		y += doc.height/2*(zoom-1);
	// 		x = x/zoom;
	// 		y = y/zoom;
	// 	}
	// 	return [x,y];
	// }

	//  scrollbar 및 postion relative와 absolute 가 있을 경우, 그리고 zoom 사용
	getXyInDocument(inX,inY){
		const doc = this.document;
		const zoom = doc.zoom;
		let x = inX - (doc.offsetLeft * zoom + doc.frame.offsetLeft + doc.frame.parentElement.offsetLeft - doc.frame.scrollLeft);
		let y = inY - (doc.offsetTop * zoom + doc.frame.offsetTop + doc.frame.parentElement.offsetTop - doc.frame.scrollTop);

		if(zoom!==1){
			x = x/zoom;
			y = y/zoom;
		}
		return [x,y];
	}


	getXyInLayer(inX,inY){
		return [inX,inY]
		// 추가 처리 안한다. prepareLayer 로 자동 처리 된다.
		// const layer = this.layer;
		// let x = inX - layer.left;
		// let y = inY - layer.top;
		// const zoom = layer.zoom;
		// if(zoom!==1){
		// 	x += layer.width/2*(zoom-1);
		// 	y += layer.height/2*(zoom-1);
		// 	x = x/zoom;
		// 	y = y/zoom;
		// }
		// return [x,y];
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

	prepareLayer(ctx){		
		const doc = this.document;
		const layer = this.document.layer;	


		// layer.angle 적용
		if(layer.angle !== 0){
			ctx.translate(layer.width / 2,layer.height / 2);
			ctx.rotate(-layer.angle*Math.PI);
			ctx.translate(-layer.width / 2,-layer.height / 2);
		}
		// layer 적용 크기 변경
		ctx.scale(1/layer.zoom,1/layer.zoom)

		// // doc.angle 적용
		if(doc.angle !== 0){
			ctx.translate(doc.width / 2 - layer.left ,doc.height / 2 - layer.top);
			ctx.rotate(-doc.angle*Math.PI);
			ctx.translate(-(doc.width / 2 - layer.left) ,-(doc.height / 2 - layer.top));
		}

		// 좌표 오차 변경		
		ctx.translate(-layer.left,-layer.top);

	}
}