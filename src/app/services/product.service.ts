import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { __values } from 'tslib';
import { PageProduct, Product } from '../model/product.model';
import { UUID } from 'angular2-uuid';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private products! : Array<Product>;
  constructor(private httpClient: HttpClient) {
    this.products=[
      {id:UUID.UUID(), name: "computer", price : 3500, promotion : true},
      {id:UUID.UUID(), name: "imprimante", price : 1200, promotion : false},
      {id:UUID.UUID(), name: "smartphone", price : 2000, promotion : true},
    ];
    for (let i = 0; i<10 ; i++){
      this.products.push({id:UUID.UUID(), name: "computer", price : 3500, promotion : true});
      this.products.push({id:UUID.UUID(), name: "imprimante", price : 1200, promotion : false});
      this.products.push({id:UUID.UUID(), name: "smartphone", price : 2000, promotion : true});
    }
  }

  public getAllProducts() : Observable<Product[]>{
     return of([...this.products]);
  }

  public  getPageProducts(page: number, size: number): Observable<PageProduct> {
    // let index =page*size;
    // let totalPages = ~~(this.products.length/size);
    // if (this.products.length % size !=0)
    // totalPages++;
    // let pageProducts = this.products.slice(index,index+size);
    return this.httpClient.get("http://127.0.0.1:3000/api/products/page?page=0&size=33") as Observable<PageProduct>;
  }
  /**
   * name
   */
  public deleteProduct(id : string) : Observable<boolean> {
    this.products=this.products.filter(p=>p.id!=id);
    return of(true);
  }

  /**
   * name
   */
  public setPromotion(id : string) : Observable<boolean> {
    let product=this.products.find(p=>p.id==id);
    if(product !=undefined){
      product.promotion=!product.promotion;
      return of(true);
    } else return throwError(()=>new Error("Product not found"));
  }

  /**
   * name
   */
  public searchProducts(keyword :string, page : number, size:number) : Observable<PageProduct>{
    let result = this.products.filter(p=>p.name.includes(keyword));
    let index =page*size;
    let totalPages = ~~(result.length/size);
    if (this.products.length % size !=0)
    totalPages++;
    let pageProducts = result.slice(index,index+size);
    return of({page:page, size:size, totalPages:totalPages, products : pageProducts});
  }
}
