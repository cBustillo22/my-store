import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ProductAPI, ProductCreateDTO, ProductUpdateDTO } from '../models/product-api.model';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';
import { environment } from '../../environments/environment';
import { checkTime } from '../interceptors/time.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api`

  constructor(private http: HttpClient) { }

  getByCategory(categoryId: string, limit?: number, offset?: number) {
    let params = new HttpParams();
    if(limit !== undefined && offset !== undefined) {
      params = params.set('limit', limit)
      params = params.set('offset', offset)
    }
    return this.http.get<ProductAPI[]>(`${this.apiUrl}/categories/${categoryId}/products`, { params })

  }

  getProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if(limit !== undefined && offset !== undefined) {
      params = params.set('limit', limit)
      params = params.set('offset', offset)
    }
    return this.http.get<ProductAPI[]>(`${this.apiUrl}/products`, { params, context: checkTime() })
      .pipe(
        retry(3),
        map(products => products.map(item => {
          return {
            ...item,
            taxes: .19 * item.price
          }
        }))
      )
  }

  getProduct(id: string) {
    return this.http.get<ProductAPI>(`${this.apiUrl}/products/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if(error.status === HttpStatusCode.InternalServerError) {
            return throwError('Something is failing on the server side')
          } else if(error.status === HttpStatusCode.NotFound) {
            return throwError('The requested product does not exist')
          } else if(error.status === HttpStatusCode.Unauthorized) {
            return throwError('You are not authorized to access the requested product')
          }
          return throwError('Ups, something went wrong')
        })
      )
  }

  create(dto: ProductCreateDTO) {
    return this.http.post<ProductAPI>(`${this.apiUrl}/products`, dto);
  }

  update(id: string, dto: ProductUpdateDTO) {
    return this.http.put<ProductAPI>(`${this.apiUrl}/products/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }

  fetchAndUpdate(id: string, dto: ProductUpdateDTO) {
    return zip( //para correr en paralelo
        this.getProduct(id),
        this.update(id, dto)
      )
  }
}
