import { AnimationBuilder, AnimationFactory, style, animate, AnimationPlayer } from '@angular/animations';
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appFadeIn]'
})
export class FadeInDirective implements OnInit {

    constructor(private element: ElementRef, private builder: AnimationBuilder) {}

    ngOnInit() {
      const factory: AnimationFactory = this.builder.build([
        style({ opacity: 0, transform: 'translateY(10px)' }), // Add transform here
        animate('0.15s ease-in', style({ opacity: 1, transform: 'translateY(0)' })) // Add transform here
      ]);
  
      const player: AnimationPlayer = factory.create(this.element.nativeElement);
  
      player.play();
    }

}