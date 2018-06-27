import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderList, OrderService } from './order.service';
import { BasicFromGroupController } from '../tools/error.form';

@Component({
    selector: 'app-orders.component',
    templateUrl: './orders.component.html'
})
export class OrdersComponent extends BasicFromGroupController implements OnInit {
    orders: OrderList[];

    constructor(private orderService: OrderService, private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.getOrders();
    }

    batchPlaced() {
        this.orderService.batchPlaced()
            .catch(err => this.processRestValidations(err));
    }
    batchValidated() {
        this.orderService.batchValidated()
            .catch(err => this.processRestValidations(err));
    }
    batchPaymentDefined() {
        this.orderService.batchPaymentDefined()
            .catch(err => this.processRestValidations(err));
    }

    getOrders() {
        this.orderService.getOrders()
            .then(orders => this.orders = orders)
            .catch(err => this.processRestValidations(err));
    }

}
