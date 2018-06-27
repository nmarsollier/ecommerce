import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BasicFromGroupController } from '../tools/error.form';
import { Order, OrderService } from './order.service';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order.detail.component.html'
})
export class OrderDetailComponent extends BasicFromGroupController implements OnInit {
    form = new FormGroup({
        orderId: new FormControl('', [Validators.required]),
        method: new FormControl('', [Validators.required]),
        amount: new FormControl('', [Validators.required]),
    });

    payment = false;
    order: Order;

    constructor(private orderService: OrderService, private route: ActivatedRoute) {
        super();
    }

    ngOnInit(): void {
        this.payment = false;
        this.route.params.subscribe(params => {
            this.form.get('orderId').setValue(params['id']);
            this.submitForm();
        });
    }

    submitForm() {
        this.payment = false;
        if (this.form.get('orderId').value) {
            this.orderService.getOrder(this.form.get('orderId').value)
                .then(order => this.order = order)
                .catch(err => this.processRestValidations(err));
        }
    }

    addPayment() {
        this.payment = true;
    }

    paymentSubmit() {
        if (this.form.get('orderId').value) {
            this.orderService
                .addPayment(
                    this.form.get('orderId').value,
                    this.form.get('method').value,
                    this.form.get('amount').value)
                .then(order => this.submitForm())
                .catch(err => this.processRestValidations(err));
        }
    }
}
