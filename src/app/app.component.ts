import { Component, OnInit } from '@angular/core';
import { Product } from './models/product.model';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { UsersService } from './services/users.service';
import { environment } from '../environments/environment';
import { TokenService } from './services/token.service';

const randomImageUrl = 'https://source.unsplash.com/random'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-store';
  name: string = 'Carlos'
  age: number = 22
  imgUrl: string = 'https://source.unsplash.com/random'
  buttonDisabled: boolean = true
  names: string[] = ['carlos', 'julian', 'jose']
  newName: string = ''
  imgWidth: number = 30;
  person = {
    name: 'Carlos',
    age: 22,
    imgUrl: 'https://source.unsplash.com/random'
  }
  box = {
    width: 100,
    height: 100,
    background: 'red',
  }
  register = {
    name: '',
    email: '',
    password: ''
  }
  imgParent: string = 'https://source.unsplash.com/random'
  showChildImage: boolean = false
  token: string = '';
  imgRta: string = '';
  showTestLearningCode = environment.showTestLearningCode

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private filesService: FilesService,
    private tokenService: TokenService
    ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if(token) {
      this.authService.getProfile().subscribe();
    }
  }

  toggleButton = () => {
    this.buttonDisabled = !this.buttonDisabled
  }

  onScroll = (event: Event) => {
    const element = event.target as HTMLElement
    console.log(element.scrollTop)
  }

  changeName = (event: Event) => {
    const element = event.target as HTMLInputElement
    this.name = element.value
  }

  addName = () => {
    this.names.push(this.newName)
    this.newName = ''
  }

  deleteName = (idx: number) => {
    this.names.splice(idx, 1)
  }

  onRegister = () => {
    console.log(this.register)
  }

  onImgLoaded(_img: string) {
    console.log('Image loaded in parent component', _img)
  }

  toggleImage() {
    this.showChildImage = !this.showChildImage;
  }

  createUser() {
    this.usersService.create({
      name: 'Carlos',
      email: 'carlos@mail.com',
      password: '12345',
      role: 'customer'
    }).subscribe((user) => {
      console.log('User created', user)
    })
  }

  login() {
    this.authService.login('carlos@mail.com', '12345')
      .subscribe((resp) => {
        console.log('User logged in', resp.access_token)
        this.token = resp.access_token
      })
  }

  getProfile() {
    this.authService.getProfile()
      .subscribe((resp) => {
        console.log('User profile', resp)
      })
  }

  downloadFile() {
    this.filesService.getFile('myPdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
      .subscribe();
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if(file) {
      this.filesService.uploadFile(file)
        .subscribe((resp) => {
          this.imgRta = resp.location
        })
    }
  }

  products: Product[] = [
    {
      id: '1',
      name: 'EL mejor juguete',
      price: 565,
      image: randomImageUrl,
      category: 'all',
    },
    {
      id: '2',
      name: 'Bicicleta casi nueva',
      price: 356,
      image: randomImageUrl
    },
    {
      id: '3',
      name: 'Colleción de albumnes',
      price: 34,
      image: randomImageUrl
    },
    {
      id: '4',
      name: 'Mis libros',
      price: 23,
      image: randomImageUrl
    },
    {
      id: '5',
      name: 'Casa para perro',
      price: 34,
      image: randomImageUrl
    },
    {
      id: '6',
      name: 'Gafas',
      price: 3434,
      image: randomImageUrl
    }
  ]
}
