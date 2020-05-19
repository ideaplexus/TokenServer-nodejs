# Live stream seller/user pages & user code & Agora Token Server

* export APP_CERTIFICATE=045c9d749cce45d888b9597e906d9c4c

* export APP_ID=88b765a2930f40cf8d0a5790701f043b


## Generating APP credentials from Agora dashboard

You can get your appID and appCertificate on Agora developer dashboard (http://dashboard.agora.io).

## After installing node.js on server

* cd into the project

* npm i

* export APP_CERTIFICATE=045c9d749cce45d888b9597e906d9c4c

* export APP_ID=88b765a2930f40cf8d0a5790701f043b

* node index.js

After this the seller page should be usable at /seller.html & user page is avalible at root / of the server address/domain.

You can add your own SSL certificates by using reverse proxy on the node port in nginx & free LetsEncrypt certificates.