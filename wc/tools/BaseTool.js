export default class BaseTool {
	constructor(editor){
		this.name = 'BaseTool';
		this.editor = editor;
		
		this.document = null;
		this.layer = null;
		this.drawLayer = null;
		
		this.x0 = null;
		this.y0 = null;
	}

	init(){
		this.document = this.editor.document??null;
        this.layer = this.document.layer??null;
        this.drawLayer = this.document.drawLayer??null;
	}
	start(){
		this.init();
	}

	down(x,y,event){
	
	}

	move(x,y,event){
	
	}

	up(x,y,event){
	
	}

	end(){
		
	}

	draw(x,y,event){
		
	}
}