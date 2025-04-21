import {Component, input, OnDestroy, OnInit} from '@angular/core';
import {OrderDTO} from '../../_models/orderDTO';
import {Subject, takeUntil} from 'rxjs';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {MapChoiceComponent} from '../map-choice/map-choice.component';
import {CompanyPointDTO} from '../../_models/pointDTO';
import {OrderService} from '../../_services/order/order.service';
import {getOrderStatusSeverity, getOrderStatusLabel, OrderStatus} from '../../_enums/order-status.enum';
import {Tag} from 'primeng/tag';
import {StatusChoiceComponent} from '../status-choice/status-choice.component';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-order',
  imports: [
    Button,
    Dialog,
    MapChoiceComponent,
    Tag,
    StatusChoiceComponent
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy {
  dataInput = input<OrderDTO>();
  private destroy$: Subject<void> = new Subject<void>();
  pointDialog: boolean = false;
  statusDialog: boolean = false;
  orderDTO!: OrderDTO;

  constructor(private orderService: OrderService,private  messageService: MessageService,) {
  }
  ngOnInit() {
    this.orderDTO=this.dataInput()!;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  hidePointDialog(): void {
    this.pointDialog = false;
  }
  hideStatusDialog(): void {
    this.statusDialog = false;
  }

  handePointChange($event: CompanyPointDTO) {
    this.hidePointDialog();
    this.orderService.updateOrderCurrentPoint(this.orderDTO.tracker,$event.id).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Местоположение обновлено',
            life: 3000
          });
         this.refreshOrder();
        },
        error: () => {}
      }
    )
  }
  private refreshOrder(): void {
    this.orderService.getOrder(this.orderDTO.tracker).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.orderDTO= response.order;
      },
      error: () => {
      }
    });
  }

  showDialogMap() {
    this.pointDialog = true;
  }
  showStatusDialog() {
    this.statusDialog = true;
  }

  protected readonly getOrderStatusLabel = getOrderStatusLabel;
  protected readonly getOrderSeverity = getOrderStatusSeverity;

  handleStatusChange($event: OrderStatus) {
    this.hideStatusDialog();
    this.orderService.updateOrderStatus(this.orderDTO.tracker,$event).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Статус обновлен',
            life: 3000
          });
          this.refreshOrder();
        },
        error: () => {}
      }
    )
  }
}
