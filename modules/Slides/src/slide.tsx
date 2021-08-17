import {Component, ComponentInterface, Host, h, getMode} from '@stencil/core';

@Component({
  tag: 'ionx-slide',
  styleUrl: 'slide.scss'
})
export class Slide implements ComponentInterface {

  render() {
    const mode = getMode(this) || window["Ionic"]["mode"];
    return (
      <Host
        class={{
          [mode]: true,
          'swiper-slide': true,
          'swiper-zoom-container': true
        }}
      >
      </Host>
    );
  }
}
