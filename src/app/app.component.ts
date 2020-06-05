import { routeAnimations } from './animations/routeAnimations.animation';
//import { AuthService } from './auth/auth.service';
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromAppStore from "./store/app.reducer";
import * as AuthActions from "./auth/store/auth.actions";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [ routeAnimations ],
})
export class AppComponent implements OnInit {
  //constructor(private authService: AuthService) {}
  constructor(private store: Store<fromAppStore.AppState>) {}

  ngOnInit() {
    //this.authService.autoLogin();
    this.store.dispatch(new AuthActions.AutoLogin());
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData["animation"]
    );
  }
}
