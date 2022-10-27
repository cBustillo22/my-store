import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { StoreService } from '../../../services/store.service'
import { AuthService } from '../../../services/auth.service'
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/models/product-api.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  counter = 0;
  user!: User | null;
  categories: Category[] = [];

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private categoriesService: CategoriesService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => this.counter = products.length)
    this.getAllCategories();
    this.authService.user$.subscribe(data => {
      this.user = data
    })
  }

  login() {
    this.authService.loginAndGetProfile('admin@mail.com', 'admin123')
      .subscribe(() => this.router.navigate(['/profile']))
  }

  getAllCategories() {
    this.categoriesService.getAll().subscribe(data => this.categories = data)
  }

  logout() {
    this.authService.logout();
    this.user = null;
    this.router.navigate(['/home']);
  }

}
