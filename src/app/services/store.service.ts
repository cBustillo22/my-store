import { Injectable } from '@angular/core';
import { ProductAPI } from '../models/product-api.model';
import { BehaviorSubject } from 'rxjs'
import { isThisQuarter } from 'date-fns';

const randomImageUrl = 'https://source.unsplash.com/random'

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() {  }

  private myShoppingCart: ProductAPI[] = [];
  private myCart = new BehaviorSubject<ProductAPI[]>([]);

  myCart$ = this.myCart.asObservable();

  getMyShoppingCart() {
    return this.myShoppingCart;
  }

  addProductoToCart(product: ProductAPI) {
    this.myShoppingCart.push(product);
    this.myCart.next(this.myShoppingCart);
  }

  getCartTotalAmount() {
    return this.myShoppingCart.reduce((sum, item) => sum + item.price, 0);
  }
}
