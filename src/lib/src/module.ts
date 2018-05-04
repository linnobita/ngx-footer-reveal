import { NgModule } from '@angular/core';
import { FooterRevealDirective } from './directive/lib.directive';

@NgModule({
  declarations: [FooterRevealDirective],
  exports: [FooterRevealDirective]
})
export class FooterRevealModule { }
