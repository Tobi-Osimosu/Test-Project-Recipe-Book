import { AuthService } from "./../auth.service";
import { User } from "./../user.model";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, Effect } from "@ngrx/effects";
import * as AuthActions from "./auth.actions";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDXyvpQkdCDD1fLfaq9mrTg8iPgOntYfWQ",
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          map(resData =>
            this.handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              resData.expiresIn
            )
          ),
          catchError(errorRes => this.handleError(errorRes))
        );
    })
  );

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDXyvpQkdCDD1fLfaq9mrTg8iPgOntYfWQ",
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          map(resData =>
            this.handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              resData.expiresIn
            )
          ),
          catchError(errorRes => this.handleError(errorRes))
        );
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        userId: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem("userData"));

      if (!userData) {
        //It just has to return something because we are in NgRx effects (action)
        return { type: "DUMMY ACTION" };
      } else {
        const loadedUser = new User(
          userData.email,
          userData.userId,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDate = new Date(userData._tokenExpirationDate);

          const newExpTime =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.autoLogout(newExpTime);

          return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: expirationDate,
            redirect: false
          });
        }
        //It just has to return something because we are in NgRx effects (action)
        return { type: "DUMMY ACTION" };
      }
    })
  );

  @Effect({ dispatch: false })
  redirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(["/"]);
      }
    })
  );

  @Effect({ dispatch: false })
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    map(() => {
      localStorage.removeItem("userData");
      this.router.navigate(["/auth"]);

      if (this.authService.tokenExpirationTimer) {
        clearTimeout(this.authService.tokenExpirationTimer);
      }
      this.authService.tokenExpirationTimer = null;
    })
  );

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: string
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    localStorage.setItem("userData", JSON.stringify(user));

    this.authService.autoLogout(+expiresIn * 1000);

    return new AuthActions.AuthenticateSuccess({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate,
      redirect: true
    });
  }

  private handleError(errorRes) {
    let errorMessage = "An unknown error occured!";
    if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This email exists already";
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "This email does not exist";
        break;
      case "INVALID_PASSWORD":
        errorMessage = "Incorrect Password";
        break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
}
