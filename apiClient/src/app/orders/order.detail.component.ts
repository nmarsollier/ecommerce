import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as errorHandler from '../tools/error.handler';
import { Order, OrderService } from './order.service';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order.detail.component.html'
})
export class OrderDetailComponent implements errorHandler.IErrorController, OnInit {
    errorMessage: string;
    errors = new Map();

    orderId = new FormControl('', [Validators.required]);
    order: Order;

    constructor(private orderService: OrderService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.orderId.setValue(params['id']);
            this.submitForm();
        });
    }

    submitForm() {
        if (this.orderId.value) {
            this.orderService.getOrder(this.orderId.value)
                .then(order => this.order = order)
                .catch(err => errorHandler.processRestValidations(this, err));
        }
    }


}
