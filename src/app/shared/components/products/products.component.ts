import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { ProductsService } from '../../../services/products.service';
import { ProductAPI, ProductCreateDTO, ProductUpdateDTO } from 'src/app/models/product-api.model';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  @Input() products: ProductAPI[] = []
  @Output() requestMoreProducts = new EventEmitter();
  @Input() set productId(id: string | null) {
    if(id) {
      this.onShowDetail(id);
    }
  }
  myTotalAmount: number = 0;
  myShoppingCart: ProductAPI[] = []
  today: Date = new Date();
  date: Date = new Date(2022, 10, 19)
  showProductDetail: boolean = false;
  productChosen!: ProductAPI;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init'
  showTestLearningCode = environment.showTestLearningCode

  constructor(
    private storeService: StoreService,
    private productService: ProductsService
  ) {
    this.myShoppingCart = storeService.getMyShoppingCart();
  }

  onAddToShoppingCart(product: ProductAPI) {
    this.storeService.addProductoToCart(product);
    this.myTotalAmount = this.storeService.getCartTotalAmount()
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading'
    if(!this.showProductDetail) {
      this.showProductDetail = true;
    }
    this.productService.getProduct(id)
      .subscribe(data => {
        this.productChosen = data
        this.statusDetail = 'success'
      }, (error) => {
        window.alert(error)
        this.statusDetail = 'error'
      })
  }

  createNewProduct() {
    const newProduct: ProductCreateDTO = {
      title: 'Nuevo Producto',
      description: 'Descripcion del nuevo producto',
      images: ['https://placeimg.com/640/480/any?random=${Math.random()}'],
      price: 1000,
      categoryId: 1,
    }
    this.productService.create(newProduct)
      .subscribe(data => {
        this.products.unshift(data);
      });
  }

  updateProduct() {
    const updatedProduct: ProductUpdateDTO = {
      title: 'New Title',
    }
    const id = this.productChosen.id;
    this.productService.update(id, updatedProduct)
      .subscribe(data => {
        const productIndex = this.products.findIndex(item => item.id === data.id);
        this.products[productIndex] = data;
        this.productChosen = data;
      })
  }

  deleteProduct() {
    this.productService.delete(this.productChosen.id)
      .subscribe(data => {
        if(data) {
          const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
          this.products.splice(productIndex, 1);
          this.showProductDetail = false;
        }
      })
  }

  readAndUpdate(id: string) { //promesas anidadas
    this.productService.getProduct(id)
      .pipe(
        switchMap(product => //para correr en serie
          this.productService.update(product.id, {title: 'New title changed'}))
      ).subscribe(data => {
        console.log(data);
      })

    this.productService.fetchAndUpdate(id, {title: 'New title changed'}) //para correr en paralelo
      .subscribe(response => {
        const [read, update] = response
        console.log(read, update)
      })
  }

  loadMoreProducts() {
    this.requestMoreProducts.emit();
  }

}
