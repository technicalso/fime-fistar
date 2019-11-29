import {Directive, ElementRef, Output, EventEmitter, HostListener, Renderer2, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Directive({
    selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
    constructor(private _elementRef: ElementRef,
                @Inject(DOCUMENT) private document: Document) {
    }
    @Output() clickOutSide: EventEmitter<any> = new EventEmitter();
    @HostListener('document:click', ['$event.target'])
    @HostListener('document:touchstart', ['$event.target'])
    public onEvent(targetElement) {
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (targetElement.attributes.id) {
            if (targetElement.attributes.id.nodeValue === 'openMenu') {
                return;
            }
        }
        if (!clickedInside) {
            const dropdown = <HTMLElement>this.document.getElementsByClassName('mobile-menu-container')[0];
            if (dropdown && dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
                this.clickOutSide.emit(null);
                return;
            }
        }
    }
}
