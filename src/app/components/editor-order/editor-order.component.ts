import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Card} from 'primeng/card';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {OrderService} from '../../_services/order/order.service';
import {Subject, takeUntil} from 'rxjs';
import {OrderDTO} from '../../_models/orderDTO';
import {OrderComponent} from '../order/order.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-editor-order',
  imports: [
    Card,
    ReactiveFormsModule,
    FloatLabel,
    InputText,
    ButtonDirective,
    Ripple,
    OrderComponent,
    NgIf
  ],
  templateUrl: './editor-order.component.html',
  styleUrl: './editor-order.component.scss'
})
export class EditorOrderComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  orderForm: FormGroup;
  orderDTO!:OrderDTO;

  constructor(private fb: FormBuilder, private orderService: OrderService) {
    this.orderForm = this.fb.group({
      tracker: [null, [Validators.required]],
    })
  }

  getOrder() {
    const tracker:string=this.orderForm.get('tracker')?.value;
    this.orderService.getOrder(tracker).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.orderForm.reset();
        this.orderDTO = response.order;
      },
      error: () => {
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
