import { AfterViewInit, DoCheck, Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';

@Directive({
  selector:"[ngxFooterReveal]"
})
export class FooterRevealDirective implements AfterViewInit, DoCheck { 
    @Input('options') public options?: any;
    @Input('shadow') public shadow?: boolean;
    @Input('shadowOpacity') public shadowOpacity?: number;
    @Input('zIndex') public zIndex?: number;
    @Input('height') public height?: number;
    @Input('width') public width?: number;

    private prev: any;
    private defaults: any;
    private settings: any;

    constructor(
        private el: ElementRef,
        private renderer: Renderer,
    ) {
        this.prev = this.el.nativeElement.previousElementSibling;
        this.defaults = new Object();
        this.settings = new Object();
    }
    
    private initialize() {
        let presets = {
            shadow: this.shadow == null ? true : this.shadow,
            shadowOpacity: this.shadowOpacity == null ? 0.8 : this.shadowOpacity,
            zIndex: this.zIndex == null ? -100 : this.zIndex
        };

        if (this.options == null) {
            this.options = new Object();
        }

        this.defaults = { ...presets, ...this.options };
        this.settings = { 
            height: this.height == null ? 0 : this.height,
            width: this.width == null ? 0 : this.width,
            ...this.defaults, ...this.options 
        };
    }

    public ngAfterViewInit() {
        this.initialize();
        this.setMarginAndWidth();
        
        if (this.el.nativeElement.offsetHeight <= window.outerHeight && 
            this.el.nativeElement.offsetTop >= window.outerHeight) {
            this.renderer.setElementStyle(this.el.nativeElement, 'z-index', this.defaults.zIndex.toString());
            this.renderer.setElementStyle(this.el.nativeElement, 'position', 'fixed');
            this.renderer.setElementStyle(this.el.nativeElement, 'bottom', '0');
            
            if (this.defaults.shadow) {
                this.renderer.setElementStyle(this.prev, 'moz-box-shadow', '0 20px 30px -20px rgba(0,0,0,' + this.defaults.shadowOpacity + ')');
                this.renderer.setElementStyle(this.prev, '-webkit-box-shadow', '0 20px 30px -20px rgba(0,0,0,' + this.defaults.shadowOpacity +')');
                this.renderer.setElementStyle(this.prev, 'box-shadow', '0 20px 30px -20px rgba(0,0,0,' + this.defaults.shadowOpacity + ')');
            }
        }
    }

    public ngDoCheck() {
        if (this.width === 0 || this.height === 0) {
            this.setMarginAndWidth();
        }
    }
    
    @HostListener('window:resize')
    @HostListener('footerRevealResize')
    onWindowLoad() {
        this.setMarginAndWidth();
    }

    private setMarginAndWidth() {
        let height = this.el.nativeElement.offsetHeight;
        let width = this.prev.offsetWidth;
        this.settings.height = height && height > 0 ? height : this.settings.height;
        this.settings.width = width && width > 0 ? width : this.settings.width;
        this.renderer.setElementStyle(this.el.nativeElement, 'width', this.settings.width.toString() + 'px');
        this.renderer.setElementStyle(this.prev, 'margin-bottom', this.settings.height.toString() + 'px');
    }
}