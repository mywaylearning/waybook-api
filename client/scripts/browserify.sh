#!/bin/bash
start=$SECONDS
browserify www/app/app.js --debug | exorcist www/app/waybook-min.js.map > www/app/waybook-min.js
  # --noparse=$PWD/www/app/components/lodash.custom.min.js \
  # --noparse=$PWD/node_modules/store/store.min.js \
  # --noparse=$PWD/www/lib/ionic/js/ionic.min.js \
  # --noparse=$PWD/www/lib/ionic/js/ionic-angular.min.js \
  # --noparse=$PWD/www/lib/angular/angular.min.js \
  # --noparse=$PWD/www/lib/angular-animate/angular-animate.min.js \
  # --noparse=$PWD/www/lib/angular-animate/angular-animate.min.js \
  # --noparse=$PWD/www/lib/angular-ui-router/release/angular-ui-router.min.js \
  # --noparse=$PWD/node_modules/restangular/dist/restangular.min.js \
  # --noparse=$PWD/node_modules/moment/min/moment.min.js |

end=$SECONDS
runtime=$((end-start))
echo "browserify + exorcist: completed in $runtime seconds"