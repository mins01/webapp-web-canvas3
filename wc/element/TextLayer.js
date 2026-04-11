// WcLayer를 wc/element/Canvas로 변경

import Layer from "./Layer.js"
import DrawText from '../draw/DrawText.js';
import CssLengthUtil from "../lib/CssLengthUtil.js";
import CssFontUtil from "../lib/CssFontUtil.js";
import Context2dTextConfig from "../lib/Context2dTextConfig.js";
import LayerKind from "../lib/LayerKind.js";

export default class TextLayer extends Layer{
    static get keys(){
        return super.keys.concat(['textConfig', 'text'])
    }

    kind = LayerKind.TEXT;
    textConfig = null;
    text = '';
    constructor(w=null,h=null){
        super(w,h);
        this.drawable = false; // 그리기 가능한가? 그리기 툴에서 체크. 설정값으로만 처리된다.
        this.textConfig = new Context2dTextConfig();
        this.text = "Input a string\nin the TextLayer." // 기본 텍스트
        this.initFromAttributes()
        this.flush();
    }

    // DOM 으로 연결되면
    #isConnectedCallback = false;  // 최초 한번만 실행한다!
    connectedCallback(){
        if(this.#isConnectedCallback){return}       
        this.#isConnectedCallback = true;
        this.initFromAttributes()
        this.flush();
        console.debug('connectedCallback',this);
    }

    initFromAttributes(){
        if(this.dataset.text !== undefined ){
            this.text = this.dataset.text
        }else if(this.textContent && this.textContent.trim().length){
            this.text = this.textContent
        }

        // console.log('style',this.style,this.style.cssText);
        // 노드의 style 적용
        if(this.style.length){
            const style = this.style;
            const styleObj = Object.fromEntries(Object.keys(style).filter(k=>k.match(/^[^\d]/) && style[k]!=='').map(k => [k,style[k]]));
            this.textConfig.assignFrom(styleObj)
        }

        // 기본 textConfig
        if(this.dataset.textConfig){
           const objTextConfig = JSON.parse(this.dataset.textConfig);
            if(objTextConfig){ this.textConfig.assignFrom(objTextConfig); }
        }

        if(this.dataset.adjustAutoHeight=='true'){ //자동 높이 조절을 할 것인가?
            this.adjustAutoHeight();
        }

        // console.log('initFromAttributes',this.text);

    }

    static register(name='wc-textlayer'){
        super.register(name);
    }

    setContextConfig(conf){
        super.setContextConfig(conf);
        // this.ctx.fillStyle = conf.foreColor;
        // this.ctx.strokeStyle = conf.backColor; // 무시하자
    }
    setTextConfig(conf){
        this.textConfig.assignFrom(conf);
        // this.ctx.fillStyle = this.textConfig.textColor; //draw 할 때 한다.
    }

    setText(text){
        this.text = text;
    }
    // 텍스트 => lines 으로 변환
    get textLines(){
        const innerWidth = this.width-(this.textConfig.paddingPx*2);
        // const innerHeight = this.height-(padding*2);
        const textLines = DrawText.textToTextLines(this.ctx,this.textConfig,this.text,innerWidth);
        return textLines;
    }
    // 텍스트의 최대 높이
    get textMaxHeight(){
        const lineHeight = this.textConfig.lineHeightPx;
        // let lineNumber = Math.floor(innerHeight/lineHeight)
        return lineHeight * this.textLines.length;
    }
    // 텍스트의 그려지는 높이
    get textHeight(){
        const innerHeight = this.height-(this.textConfig.paddingPx*2);
        const lineHeight = this.textConfig.lineHeightPx;
        let lineNumber = Math.floor(innerHeight/lineHeight)
        let heightedLines = this.textLines.slice(0,0+lineNumber);

        return lineHeight * heightedLines.length;
    }

    // 텍스트 내용에 맞춰서
    // 자동 높이 조정
    adjustAutoHeight(){
        this.height = this.textMaxHeight+(this.textConfig.paddingPx*2);
        // console.log('adjustAutoHeight',this.height);
        
    }
    
    // get foreColor(){ return this.fillStyle; }
    // set foreColor(v){ this.fillStyle = v; }

    isFontLoading = false; //페일 백으로 로딩을 한번만 하게 한다.
    flush(){
        const font = `${this.textConfig.fontSize} ${this.textConfig.fontFamily}`;
        
        const isLoaded = document.fonts.check(font,this.text); //여러 이유 때문에 항상 false가 나올 수 있다. 참고용으로만 사용하고 load를 한번만 하게 한다.
        // 항상 false가 나오는건 load()와 아규멘트 같게 하면 해결 되는 것 같음

        // console.log('font load check',font,isLoaded);
        if(!isLoaded && !this.isFontLoading){
            // console.log('font loading',font);
            this.isFontLoading = true;
            document.fonts.load(font,this.text).then((fontFaces)=>{
                // console.log('load',loadedFonts);
                return document.fonts.ready;
            }).then((fontFaceSet)=>{
                // console.log('font load',fontFaceSet);
                this.flush();
            }).catch((e)=>{
                console.error(e)
            });
        }else{
            // console.log('font loaded',font);
            super.flush();
            this.isFontLoading = false;
        }
    }
    draw(){
        const ctx = this.ctx;
        // ctx.fillStyle = this.textConfig.textColor;
        // ctx.fillStyle = this.textConfig.color;
        // console.log(this.textConfig,ctx);
        
        ctx.clearRect(0,0,this.width,this.height);

        this.contextConfig.assignTo(ctx,true);
        this.textConfig.assignTo(ctx); // ctx.fillStyle = this.textConfig.color; 이게 동작함.

        DrawText.draw(ctx,this.textConfig,this.text,Math.abs(this.width),Math.abs(this.height),0,0 )
        // this.dispatchEvent( new CustomEvent("draw", {bubbles:true,cancelable:true}) );        
        super.draw();
    }
}
