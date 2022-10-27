import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ProductAPI } from 'src/app/models/product-api.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  categoryId: string | null = null;
  limit: number = 10
  offset: number = 0
  products: ProductAPI[] = []
  productId!: string | null
  queryParams$: Subscription = new Subscription()

  constructor(private route: ActivatedRoute, private productsService: ProductsService) { }

  ngOnDestroy(): void {
    this.queryParams$.unsubscribe();
  }

  ngOnInit(): void {
      this.route.paramMap
        .pipe(
          switchMap(params => {
            this.categoryId = params.get('id')
            if (this.categoryId) {
              this.offset = 0;
              this.limit = 10;
              return this.productsService.getByCategory(this.categoryId, this.limit, this.offset)
            }
            return [];
          })
        ).subscribe(response => {
      this.products = [...response];
      this.offset += this.limit;
    }
    )
    this.queryParams$ = this.route.queryParamMap.subscribe(params => {
      this.productId = params.get('product')
    })
  }

  getPagedProductsByCategory() {
    if(this.categoryId) {
      this.productsService.getByCategory(this.categoryId, this.limit, this.offset)
       .subscribe(data => {
        this.products = [...this.products, ...data];
        this.offset += this.limit;
       })
    }
  }

}
