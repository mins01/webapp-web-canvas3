export default class BaseTool {
	constructor(editor){
		this.name = 'BaseTool';
		this.editor = editor;

		this.document = null;
		this.layer = null;
		this.drawLayer = null;

		this.x0 = null;
		this.y0 = null;
		this.x = null;
		this.y = null;
	}

	init(){
		this.document = this.editor.document??null;
		this.layer = this.document.layer??null;
		this.drawLayer = this.document.drawLayer??null;
		if(this.document) this.document.ready()

		this.x0 = null;
		this.y0 = null;
		this.x = null;
		this.y = null;

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

	getXYForLayer(event){
		const doc = this.document;
		const layer = this.document.layer;
		const zoom = parseFloat(doc.zoom);

		let x = event.x - doc.offsetLeft - layer.left + window.scrollX;
		let y = event.y - doc.offsetTop - layer.top + window.scrollY;

		if(zoom!==1){
			const gLeft = doc.width/2*(zoom-1)
			const gTop = doc.height/2*(zoom-1)
			x += gLeft;
			y += gTop;
			x = x/zoom;
			y = y/zoom;
		}

		return [x,y];
	}
	getXYForDocument(event){
		const doc = this.document;
		const zoom = parseFloat(doc.zoom);
		let x = event.x - doc.offsetLeft + window.scrollX;
		let y = event.y - doc.offsetTop + window.scrollY;
		if(zoom!==1){
			const gLeft = doc.width/2*(zoom-1)
			const gTop = doc.height/2*(zoom-1)
			x += gLeft;
			y += gTop;
			x = x/zoom;
			y = y/zoom;
		}
		
		return [x,y];
	}
}