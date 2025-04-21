import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {OrderDTO} from "../../_models/orderDTO";
import {StorageService} from "../storage/storage.service";
import {JwtService} from "../auth/jwt.service";
import {catchError} from "rxjs/operators";
import {PageResult} from '../../_models/page-result';
import {CompanyPointDTO} from '../../_models/pointDTO';
import {OrderStatus} from '../../_enums/order-status.enum';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient, private storageService: StorageService, private jwtService: JwtService) {
  }

  updateOrderCurrentPoint(tracker:string,pointId:number) {
    return this.http.patch<void>(`${environment.apiUrl}/orders/${tracker}/point`,{pointId:pointId}).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  updateOrderStatus(tracker:string,status:OrderStatus) {
    return this.http.patch<void>(`${environment.apiUrl}/orders/${tracker}/status`,{status:status}).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  getOrder(tracker:string) {
    return this.http.get<{order:OrderDTO}>(`${environment.apiUrl}/orders/${tracker}`,).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  private parseMessage(response: any): any {
    if (!response || !response.message) {
      throw new Error('Data is missing');
    }
    return response.message;
  }
}

