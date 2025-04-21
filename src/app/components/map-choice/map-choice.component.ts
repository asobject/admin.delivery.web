import {AfterViewInit, Component, input, NgZone, OnDestroy, OnInit, output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {PointService} from '../../_services/location/point.service';
import {GeoService} from '../../_services/yMap/geo.service';
import {finalize, forkJoin, Subject, takeUntil} from 'rxjs';
import {ScrollerModule} from 'primeng/scroller';
import {Card} from 'primeng/card';
import {CompanyPointDTO} from '../../_models/pointDTO';
import {NgIf} from '@angular/common';
import {ClusterDTO} from '../../_models/clusterDTO';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {Coordinates} from '../../_models/coordinates';
import {getPointTypeLabel} from '../../_enums/point-type.enum';
import {ConfirmPopup} from 'primeng/confirmpopup';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-map-choice',
  imports: [
    Button,
    Dialog,
    Card,
    ConfirmPopup,
    ConfirmDialog
  ],
  templateUrl: './map-choice.component.html',
  styleUrl: './map-choice.component.scss'
})
export class MapChoiceComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  dataInput = input<Coordinates>();
  dataOutput = output<CompanyPointDTO>();
  clusters: ClusterDTO[] = [];
  selectedPoint!: CompanyPointDTO;
  isChild: boolean = false;
  selectedClusterId!: number;
  lazyLoading: boolean = true
  loadLazyTimeout: any;
  totalRecords: number = 0;
  private map: any;
  private ymaps = (window as any).ymaps;
  private center: Coordinates = {latitude: 55.0415, longitude: 82.9346};
  loading: boolean = false;
  pointDialog: boolean = false;

  constructor(private pointService: PointService, private fb: FormBuilder, private ngZone: NgZone, private geoService: GeoService,private confirmationService: ConfirmationService, private messageService: MessageService) {

  }

  ngOnInit() {
    if (this.dataInput()) {
      this.isChild = true;
      this.center = this.dataInput()!;
    }
  }

  ngAfterViewInit(): void {
    this.pointService.getClusters()
      .pipe(
        finalize(() => this.initMap()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (clusters) => {
          this.clusters = clusters;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  private initMap(): void {
    this.ymaps.ready(() => {
      this.map = new this.ymaps.Map('map', {
        center: [this.center.latitude, this.center.longitude],
        zoom: 11.5,
        controls: ['zoomControl', 'typeSelector', 'geolocationControl'],
      });
      this.addMarkers();
    });
  }


  private addMarkers(): void {
    this.clusters.forEach((cluster: ClusterDTO) => {
      const coords = [cluster.coordinates.latitude, cluster.coordinates.longitude];

      // Создаем метку с данными кластера в свойствах
      const placemark = new this.ymaps.Placemark(coords, {
        clusterId: cluster.id // сохраняем ID в свойствах метки
      }, {
        preset: 'islands#icon', // стиль метки
        iconColor: '#0095b6'
      });

      // Обработчик клика
      placemark.events.add('click', (e: any) => {
        this.ngZone.run(() => {
          // Получаем данные из метки
          const target = e.get('target');
          const clusterId = target.properties.get('clusterId');

          // Передаем данные в сервис
          this.handleMarkerClick(clusterId);
        });
      });

      this.map.geoObjects.add(placemark);
    });
  }

  private handleMarkerClick(clusterId: number): void {
    this.pointService.getPoint(clusterId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
       this.selectedPoint=data;
        this.confirmationService.confirm({
          header: 'Подтверждение',
          acceptLabel: 'Выбрать',
          rejectVisible: false,
          accept: () => {
            this.dataOutput.emit(this.selectedPoint);
          },
        });
      },
      error: (err) => console.error(err)
    });
  }



  submit(): void {
    this.dataOutput.emit(this.selectedPoint);
  }

  hideDialog() {
    this.pointDialog = false;
  }


  //
  // onLazyLoad(event: LazyEvent) {
  //   this.lazyLoading = true;
  //
  //   if (this.loadLazyTimeout) {
  //     clearTimeout(this.loadLazyTimeout);
  //   }
  //
  //   this.pointService.getPoints(event.first + 1, 2).pipe(
  //     takeUntil(this.destroy$),
  //     finalize(() => {
  //       this.lazyLoading = false;
  //     })
  //   ).subscribe({
  //     next: (result) => {
  //       this.points = this.points.concat(result.data);
  //       this.totalRecords = result.totalRecords;
  //     },
  //     error: () => {
  //     }
  //   });
  // }

  // onPointSelect(event: any) {
  //   // event.value содержит выбранный элемент
  //   const selectedItem = event.value as PointDTO;
  //   // Выполните зум на карте по координатам выбранного элемента
  //   if (selectedItem) {
  //     this.setCenter(selectedItem.coordinates.latitude, selectedItem.coordinates.longitude);
  //   }
  // }

  // private loadOffices(): void {
  //   this.officeService.getOffices().pipe(
  //     catchError((err) => {
  //       console.error('Failed to load offices:', err.message);
  //       this.isLoading = false;
  //       return of([]); // Возвращаем пустой массив при ошибке
  //     })
  //   ).subscribe({
  //     next: (points) => {
  //       // this.points = points; // Сохраняем полученные офисы
  //       this.isLoading = false;
  //       this.initMap();
  //     }
  //   });
  // }


  // selectOffice() {
  //   this.dataOutput.emit(this.office?.value);
  // }

  private setCenter(lat: number, lng: number) {
    this.map.setCenter([lat, lng], 15, {
      duration: 500,
      checkZoomRange: false
    });
    // this.map.panTo([lat, lng], {
    //   flying: true, // Включает анимацию
    //   duration: 500,
    // });
  }

  closeForm() {
    //this.point?.setValue(null);
  }

  // clickListOffices(office: Office): void {
  //   this.setCenter(office.location.latitude, office.location.longitude);
  // }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly getPointTypeLabel = getPointTypeLabel;
}
