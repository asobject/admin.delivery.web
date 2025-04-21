import {Component, input, OnInit, output} from '@angular/core';
import {FloatLabel} from "primeng/floatlabel";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Select} from "primeng/select";
import {getPointStatusOptions} from "../../_enums/point-status.enum";
import {getOrderStatusLabel, getOrderStatusOptions, OrderStatus} from '../../_enums/order-status.enum';
import {Coordinates} from '../../_models/coordinates';
import {CompanyPointDTO} from '../../_models/pointDTO';

@Component({
  selector: 'app-status-choice',
  imports: [
    FloatLabel,
    ReactiveFormsModule,
    Select,
    FormsModule
  ],
  templateUrl: './status-choice.component.html',
  styleUrl: './status-choice.component.scss'
})
export class StatusChoiceComponent implements OnInit {
  dataInput = input<OrderStatus>();
  dataOutput = output<OrderStatus>();
  selectedStatus!: OrderStatus;

  ngOnInit() {
    if (this.dataInput())
      this.selectedStatus = this.dataInput()!;
  }

  protected readonly getPointStatusOptions = getPointStatusOptions;

  onSelect(): void {
    this.dataOutput.emit(this.selectedStatus);
  }

  protected readonly getOrderStatusLabel = getOrderStatusLabel;
  protected readonly getOrderStatusOptions = getOrderStatusOptions;
}
