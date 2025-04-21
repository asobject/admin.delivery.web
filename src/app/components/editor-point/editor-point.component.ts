import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Card} from 'primeng/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {ConfirmationService, MessageService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {Toolbar} from 'primeng/toolbar';
import {finalize, forkJoin, Subject, takeUntil} from 'rxjs';
import {PointService} from '../../_services/location/point.service';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {Select} from 'primeng/select';
import {FloatLabel} from 'primeng/floatlabel';
import {CompanyPointDTO} from '../../_models/pointDTO';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {GeoService} from '../../_services/yMap/geo.service';
import {Paginator} from 'primeng/paginator';
import {Tag} from 'primeng/tag';
import {UpdatePointRequest} from '../../_models/update-point-request';
import {getPointTypeLabel, getPointTypeOptions} from '../../_enums/point-type.enum';
import {
  getPointSeverity,
  getPointStatusLabel,
  getPointStatusOptions,
  PointStatus
} from '../../_enums/point-status.enum';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-editor-point',
  imports: [
    Card,
    ReactiveFormsModule,
    FormsModule,
    Button,
    PrimeTemplate,
    TableModule,
    Toolbar,
    Dialog,
    InputText,
    NgIf,
    FloatLabel,
    AutoComplete,
    Paginator,
    Select,
    Tag,
  ],
  templateUrl: './editor-point.component.html',
  styleUrl: './editor-point.component.scss'
})
export class EditorPointComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  pointDialog: boolean = false;
  points: CompanyPointDTO[] = [];
  point!: CompanyPointDTO;
  submitted: boolean = false;
  totalRecords: number = 0;
  selectedPoints: CompanyPointDTO[] = [];
  cols: Column[];
  loading: boolean = true;
  pointForm: FormGroup;
  suggestions: string[] = [];
  isEdit: boolean = false;

  @ViewChild(Paginator) paginator!: Paginator;

  constructor(
    private fb: FormBuilder,
    private pointService: PointService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private geoService: GeoService,
  ) {
    this.pointForm = fb.group({
      name: [null, [Validators.required, Validators.maxLength(20)]],
      address: [null, [Validators.required]],
      pointType: [null, [Validators.required]],
      pointStatus: [null, [Validators.required]]
    });
    this.cols = [
      {field: 'country', header: 'Страна'},
      {field: 'locality', header: 'город'},
      {field: 'address', header: 'Адрес'},
      {field: 'name', header: 'Наименование'},
      {field: 'pointType', header: 'Тип пункта'},
      {field: 'pointStatus', header: 'Статус пункта'}
    ];
  }

  ngOnInit(): void {

   this.pointService.getPoints(1, 10) .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: points => {
          this.points = points.data;
          this.totalRecords = points.totalRecords;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
        }
      });

  }

  private savePoint(point: CompanyPointDTO): void {
    console.log(point);
    this.pointService.addPoint(point)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (): void => {
          this.loadPoints();
          this.hideDialog()
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Пункт добавлен',
            life: 3000
          });
        },
        error: (err) => {
          this.loading = false;
          console.error('Ошибка добавления:', err)
        }
      });
  }

  addPoint(): void {
    if (!this.isEdit) {
      this.geoService.getGeocode(this.pointForm.get('address')?.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            console.log(this.pointForm);
            const point: CompanyPointDTO = {
              id: 0,
              name: this.pointForm.get('name')?.value,
              pointType: this.pointForm.get('pointType')?.value,
              pointStatus: this.pointForm.get('pointStatus')?.value,
              coordinates: data.coordinates,
              country: data.country,
              province:data.province,
              locality: data.locality,
              address: this.pointForm.get('address')?.value
            };
            this.savePoint(point);
          },
          error: (err) => {
            this.suggestions = [];
            console.error('Ошибка загрузки гео-данных:', err)
          }
        });
    } else {

      const request: UpdatePointRequest = {
        name: this.pointForm.get('name')?.value == this.point.name ? null : this.pointForm.get('name')?.value,
        pointType: this.pointForm.get('pointType')?.value.Id == this.point.pointType ? null : this.pointForm.get('pointType')?.value,
        pointStatus: this.pointForm.get('pointStatus')?.value.Id == this.point.pointStatus ? null : this.pointForm.get('pointStatus')?.value,
      }
      this.updatePoint(this.point.id, request);
    }
  }


  loadSuggestions(event: AutoCompleteCompleteEvent): void {
    const query: string = event.query.trim();

    if (query.length < 5) {
      this.suggestions = [];
      return;
    }

    this.geoService.getSuggestions(query, ['house'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.suggestions = data,
        error: (err) => {
          this.suggestions = [];
          console.error('Ошибка загрузки подсказок:', err)
        }
      });

  }

  refreshPoints(): void {
    this.paginator.changePage(0);
  }

  loadPoints(event?: any): void {
    this.loading = true;
    const page = event?.page ?? 0;
    const pageSize = event?.rows ?? 10;
    this.pointService.getPoints(page + 1, pageSize).pipe(takeUntil(this.destroy$),finalize(()=>this.loading=false)).subscribe(
      {
        next: result => {
          this.points = [];
          this.points = result.data;
          this.totalRecords = result.totalRecords;
        },
        error: () => {
        }
      }
    );
  }

  openNew() {
    this.pointForm.reset();
    this.point = new CompanyPointDTO();
    this.submitted = false;
    this.pointDialog = true;
  }

  private updatePoint(id: number, request: UpdatePointRequest): void {
    this.pointService.patchPoint(id, request).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (): void => {
          this.loadPoints();
          this.hideDialog()
        },
        error: (): void => {
        }
      }
    )
  }

  editPoint(point: CompanyPointDTO) {
    this.isEdit = true;
    this.point = point;
    this.pointForm.reset();
    this.pointForm.get('name')?.setValue(point.name);
    this.pointForm.get('pointType')?.setValue(point.pointType);
    this.pointForm.get('pointStatus')?.setValue(point.pointStatus);

    this.submitted = false;
    this.pointDialog = true;
  }

  deleteSelectedPoints() {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите удалить выбранные пункты?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отменить',
      accept: (): void => {
        const selectedIds: number[] = this.selectedPoints.map((point: CompanyPointDTO): number => point.id);
        this.pointService.deletePoints(selectedIds).pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: (): void => {
              this.messageService.add({
                severity: 'success',
                summary: 'Успех',
                detail: 'Пункты удалены',
                life: 3000
              });
            },
            error: (): void => {
            }
          }
        );
      }
    });
  }

  hideDialog() {
    this.isEdit = false;
    this.pointDialog = false;
    this.submitted = false;
  }

  deletePoint(point: CompanyPointDTO) {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите удалить ' + point.name + '?',
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отменить',
      accept: (): void => {
        const ids: number[] = [point.id];
        this.pointService.deletePoints(ids).pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: (): void => {
              this.messageService.add({
                severity: 'success',
                summary: 'Успех',
                detail: 'Пункт удален',
                life: 3000
              });
            },
            error: (): void => {
            }
          }
        );
      }
    });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly getPointStatusLabel = getPointStatusLabel;
  protected readonly getPointTypeLabel = getPointTypeLabel;
  protected readonly getPointTypeOptions = getPointTypeOptions;
  protected readonly getPointStatusOptions = getPointStatusOptions;
  protected readonly getPointSeverity = getPointSeverity;
}
