# oidc-plugin
Plugin for OpenID Connect authorization with Origo.

Requires Origo 2.1.1 or later, Origo server with auth (not yet in the core) and a OpenID connect provider.

#### Example usage of OIDC-plugin

**index.html:**
```
    <head>
    	<meta charset="utf-8">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    	<meta http-equiv="X-UA-Compatible" content="IE=Edge;chrome=1">
    	<title>Origo exempel</title>
    	<link href="css/style.css" rel="stylesheet">
    </head>
    <body>
    <div id="app-wrapper">
    </div>
    <script src="js/origo.js"></script>
    <script src="plugins/oidc.min.js"></script>

    <script type="text/javascript">
    	//Init origo
    	Oidc.createOidcAuth(
        {
          externalSessionUrl: 'https://....',
          updateSessionOnRefresh: true,
          sessionRefreshTimeout: 59,
          tokenEndpoint: '/origoserver/auth/access_token',
          authorizeEndpoint: '/origoserver/auth/authorize'
        },
        client => {
          if (client.getUser().authenticated) {
            var origo = Origo('index.json');
            var oidcComponent = Oidc.OidcComponent(client);
    	      origo.on('load', function (viewer));
        viewer.addComponent(oidcComponent);
    	});
        }
          else {
            client.authorize();
          }
        }
      );
    </script>
```
## Settings
### Plugin component settings (in html file)
Option | Type | Description
---|---|---
`externalSessionUrl` | string | Url to... Required.
`updateSessionOnRefresh` | boolean | If the session.... Default is `true`.
`sessionRefreshTimeout` | number | Time interval for.... Required.
`tokenEndpoint` | string | Path to origo server.... Required.
`authorizeEndpoint` | string | Path to origo server.... Required.

