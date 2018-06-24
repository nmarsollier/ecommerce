// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authServerUrl : 'http://localhost:3000/v1/',
  imageServerUrl : 'http://localhost:3001/v1/',
  catalogServerUrl : 'http://localhost:3002/v1/',
  cartServerUrl : 'http://localhost:3003/v1/',
  orderServerUrl: 'http://localhost:3004/v1/',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
