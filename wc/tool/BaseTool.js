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

		if(this.layer){ Object.assign(this.layer.ctx,this.editor.ctxConf.toObject());}
		if(this.drawLayer){ Object.assign(this.drawLayer.ctx,this.editor.ctxConf.toObject());}
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
		let doc = this.document;
		let layer = this.document.layer;
		let x = event.x - doc.offsetLeft - layer.x + window.scrollX;
		let y = event.y - doc.offsetTop - layer.y + window.scrollY;
		return [x,y];
	}
	getXYForDocument(event){
		let doc = this.document;
		let x = event.x - doc.offsetLeft + window.scrollX;
		let y = event.y - doc.offsetTop + window.scrollY;
		return [x,y];
	}
}