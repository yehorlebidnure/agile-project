import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-authentication-page',
    templateUrl: './authentication-page.component.html',
    styleUrls: ['./authentication-page.component.scss']
})
export class AuthenticationPageComponent implements OnInit {
    public form: FormGroup;

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {
    }

    /**
     * handle registration
     */
    public async handleRegistration() {
        if (await this.authService.registration(this.form.value)) {
            this.router.navigateByUrl('/');
        } else {
            this.email.setValue('');
            this.password.setValue('');
            this.form.markAsPristine();
        }
    }

    /**
     * handle login
     */
    public async handleLogin() {
        if(await this.authService.login(this.form.value)) {
            this.router.navigateByUrl('/');
        } else {
            this.password.setValue('');
            this.form.markAsPristine();
        }
    }

    /**
     * setup form control group with validation
     * @return void
     */
    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(50),
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(50),
            ]),
        });
    }

    /**
     * get email controls
     * @return {AbstractControl}
     */
    get email(): AbstractControl {
        return this.form.get('email');
    }

    /**
     * get password controls
     * @return {AbstractControl}
     */
    get password(): AbstractControl {
        return this.form.get('password');
    }

}
