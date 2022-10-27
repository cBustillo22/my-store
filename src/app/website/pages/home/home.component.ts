import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductAPI } from 'src/app/models/product-api.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private productsService: ProductsService, private route: ActivatedRoute) { }

  products: ProductAPI[] = []
  limit: number = 10
  offset: number = 0
  productId!: string | null

  ngOnInit(): void {
    this.getProductsPaged();
    this.route.queryParamMap.subscribe(params => {
      this.productId = params.get('product');
    })
  }

  getProductsPaged() {
    this.productsService.getProducts(this.limit, this.offset)
      .subscribe(data => {
        this.products = [...this.products, ...data]
        this.offset += this.limit
      });
  }

}
