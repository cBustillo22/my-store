import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductAPI } from 'src/app/models/product-api.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private location: Location
    ) { }

  product!: ProductAPI | null
  productId!: string | null


  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          this.productId = params.get('id')
          if(this.productId) {
            return this.productsService.getProduct(this.productId)
          }
          return [null];
        })
      ).subscribe(data => {
          this.product = data;
        }
      )
  }

  goBack() {
    this.location.back()
  }

}
