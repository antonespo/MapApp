import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appAppHighlight]',
})
export class AppHighlightDirective implements OnInit {
  @Input() defualtColor: string = 'transparent';
  @Input('appAppHighlight') highlightColor: string = 'blue';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Text to lowercase
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'textContent',
      this.elementRef.nativeElement.textContent.toLowerCase()
    );
  }

  @HostListener('mouseenter')
  onMouseover(eventData: Event) {
    // Text to uppercase
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'textContent',
      this.elementRef.nativeElement.textContent.toUpperCase()
    );

    // Background blue
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-color',
      this.highlightColor
    );
  }

  @HostListener('mouseleave')
  onMouseleave(eventData: Event) {
    // Text to lowercase
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'textContent',
      this.elementRef.nativeElement.textContent.toLowerCase()
    );

    // Background transparent
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-color',
      this.defualtColor
    );
  }
}
