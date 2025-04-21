import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, pipe, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError} from "rxjs/operators";
import {PageResult} from '../../_models/page-result';
import {CompanyPointDTO} from '../../_models/pointDTO';
import {UpdatePointRequest} from '../../_models/update-point-request';
import {ClusterDTO} from '../../_models/clusterDTO';


@Injectable({
  providedIn: 'root',
})


export class PointService {
  constructor(
    private http: HttpClient) {
  }

  addPoint(point: CompanyPointDTO): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/points`, point).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  deletePoints(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/points`, {
      body: {ids:ids}
    }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getClusters(): Observable<ClusterDTO[]> {
    return this.http.get<{clusters:ClusterDTO[]}>(`${environment.apiUrl}/points/clusters`).pipe(
      map(response=>response.clusters),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  patchPoint(id: number, request: UpdatePointRequest): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/points/${id}`, request).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getPoint(id: number): Observable<CompanyPointDTO> {
    const params = new HttpParams()
      .set('id', id.toString())
    return this.http.get<{data:CompanyPointDTO}>(`${environment.apiUrl}/points`,{params}).pipe(
      map(response=>response.data),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getPoints(pageNumber: number = 1, pageSize: number = 10): Observable<PageResult<CompanyPointDTO>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PageResult<CompanyPointDTO>>(`${environment.apiUrl}/points`, {params}).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
