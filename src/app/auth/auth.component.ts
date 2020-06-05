import { OnDestroy } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as fromAppStore from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";
import { Subscription } from "rxjs";
//import { AuthService, AuthResponseData } from "./auth.service";
// import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  storeSub: Subscription;

  constructor(
    // private authService: AuthService,
    // private router: Router,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select("auth").subscribe(authState => {
      this.error = authState.authError;
      this.isLoading = authState.loading;
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    //let authObs: Observable<AuthResponseData>;
    //this.isLoading = true;

    if (this.isLoginMode) {
      //authObs = this.authService.login(email, password);
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      //authObs = this.authService.signup(email, password);
      this.store.dispatch(
        new AuthActions.SignupStart({ email: email, password: password })
      );
    }

    // authObs.subscribe(
    //   resData => {
    //     console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(["/recipes"]);
    //   },
    //   errorRes => {
    //     console.log(errorRes);
    //     this.error = errorRes;
    //     this.isLoading = false;
    //   }
    // );

    form.reset();
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
