import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as errorHandler from '../tools/error.handler';
import { OrderList, OrderService } from './order.service';

@Component({
    selector: 'app-orders.component',
    templateUrl: './orders.component.html'
})
export class OrdersComponent implements errorHandler.IErrorController, OnInit {
    errorMessage: string;
    errors = new Map();

    orders: OrderList[];

    constructor(private orderService: OrderService, private router: Router) { }

    ngOnInit(): void {
        this.getOrders();
    }

    batchPlaced() {
        this.orderService.batchPlaced()
            .catch(err => errorHandler.processRestValidations(this, err));
    }

    getOrders() {
        this.orderService.getOrders()
            .then(orders => this.orders = orders)
            .catch(err => errorHandler.processRestValidations(this, err));
    }

}
