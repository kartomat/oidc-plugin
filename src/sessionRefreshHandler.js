import Origo from 'Origo';


const SessionRefreshHandler = function SessionRefreshHandler(externalSessionUrl, sessionRefreshTimeout, tokenEndpoint) {
  let oidc_user;

  function setOidcUser() {
    const user_string = window.sessionStorage.getItem('oidc_user');
    oidc_user = JSON.parse(user_string);
  }

  const initTimer = function initTimer() {
    const timeOut = sessionRefreshTimeout * 60 * 1000;
    setTimeout(() => {
      sessionRefreshLoop();
      // callExternalService(service);
    }, timeOut);
  };

  function sessionRefreshLoop() {
    console.log('sessionRefreshLoop')
    fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: oidc_user.refresh_token
      })
    })
      .then(res => {
        console.log('then 1');
        if (res.ok) return res.json();
        else throw 'Responded with fail';
      })
      .then(data => {
        console.log('then 2');
        const { access_token, refresh_token } = data;
        window.sessionStorage.setItem(
          'oidc_user',
          JSON.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            id_token: '',
            displayname: oidc_user.displayname,
            sub: oidc_user.sub
          })
        );
        setOidcUser();
        callExternalService();
      })
      .catch(e => console.log('Something went terribly wrong 1', e));
  }

  const callExternalService = function callExternalService() {
    console.log('callExternalService');
    const completeUrl = externalSessionUrl;
    if (externalSessionUrl.includes('?')) {
      completeUrl += `&access_token=${oidc_user.access_token}`;
    } else {
      completeUrl += `?access_token=${oidc_user.access_token}`;
    }
    fetch(completeUrl).then(res => {
        console.log('then 3');
        if (res.ok) {
          console.log(
            `Successfully renewed session with an access_token on ${externalSessionUrl} at ${new Date().toLocaleString()}`
          );
          initTimer();
        } else {
          console.log('external service not ok')
          setTimeout(callExternalService(), 60 * 1000);
        }
      })
      .catch(e => {
        setTimeout(callExternalService(), 60 * 1000);
        console.log('Something went terribly wrong 2', e);
      });
  };

  return Origo.ui.Component({
    name: 'sessionRefreshHandler',
    onInit() {
      console.log('init session refresh handler')
      setOidcUser();
      initTimer();
    },
    onAdd(evt) {},
    render() {}
  });
};

export default SessionRefreshHandler;
