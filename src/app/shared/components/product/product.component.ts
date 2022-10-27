import { Component, Input, Output, EventEmitter} from '@angular/core';
import { ProductAPI } from 'src/app/models/product-api.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  @Input() product!: ProductAPI;
  @Output() addedProduct = new EventEmitter<ProductAPI>();
  @Output() showDetail = new EventEmitter<string>();
  showTestLearningCode: boolean = environment.showTestLearningCode;

  constructor() { }

  onAddToCart() {
    this.addedProduct.emit(this.product)
  }

  onShowDetail() {
    this.showDetail.emit(this.product.id)
  }

}
