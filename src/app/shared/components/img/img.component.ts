import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent {

  img: string = 'Initial img';

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('img') set changeImg(newImage: string) {
    //console.log('image changed ->', newImage);
    this.img = newImage
  }
  @Output() loaded = new EventEmitter<string>();

  defaultImg: string = 'https://www.w3schools.com/howto/img_avatar.png';
  intervalCounter: number = 0;
  intervalFn: number | undefined;

  constructor() { }
  //ngOnDestroy(): void {
    //window.clearInterval(this.intervalFn);
  //}

  //ngOnInit(): void {
    //crea intervalo cuando se inicializa componente
    /*this.intervalFn = window.setInterval(() => {
      this.intervalCounter ++;
      console.log('Interval', this.intervalCounter)
    }, 1000)*/
  //}

  onImgLoaded() {
    //console.log('Image loaded in child component')
    this.loaded.emit(this.img);
  }

  onImgError() {
    this.img = this.defaultImg;
  }

}
