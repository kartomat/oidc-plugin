const OidcComponent = function OidcComponent(oidc) {
  const closeIcon = '#ic_close_24px';
  const menuIcon = '#person';
  const logoutIcon = '#logout';
  let viewer;
  let target;
  let isExpanded = false;
  let headerComponent;
  let contentComponent;
  let closeButton;
  let oidcMenu;
  let oidcMenuEl;
  let userAvatarButton;
  let userAvatarButtonEl;
  let logoutButton;
  let logoutButtonEl;
  let userNameItem;
  let userNameItemEl;

  const toggleUserMenu = function toggleUserMenu() {
    oidcMenuEl.classList.toggle('faded');
    userAvatarButtonEl.classList.toggle('faded');
    isExpanded = !isExpanded;
  };

  const close = function close() {
    if (isExpanded) {
      toggleUserMenu();
    }
  };

  const onMapClick = function onMapClick() {
    close();
  };

  const MenuItem = function MenuItem({ icon, click, title = '', useButton = true } = {}) {
    let button;
    if (useButton) {
      button = Origo.ui.Button({
        cls: 'icon-smaller compact no-grow',
        click,
        icon
      });
    }
    const titleCmp = Origo.ui.Element({ cls: 'grow padding-left', innerHTML: title });
    return Origo.ui.Component({
      close,
      onInit() {
        if (useButton) this.addComponent(button);
      },
      onAdd() {
        this.on('render', this.onRender);
      },
      onRender() {
        if (useButton) {
          document.getElementById(titleCmp.getId()).addEventListener('click', () => {
            button.dispatch('click');
          });
        }
      },
      render() {
        return `<li class="flex row align-center padding-x padding-y-smaller ${useButton ? 'hover pointer' : ''}">
                    ${useButton ? button.render() : ''}
                    ${titleCmp.render()}
                  </li>`;
      }
    });
  };

  function addSvgIcons() {
    const svgIcons = `
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol id="person" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </symbol>
      <symbol id="logout" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
      </symbol>
      <symbol id="fa-user" viewBox="0 0 512 512">
        <path d="m457 401c0 23-7 41-21 55-14 13-32 19-55 19l-250 0c-23 0-41-6-55-19-14-14-21-32-21-55 0-10 0-20 1-29 1-10 2-20 4-31 2-11 4-22 7-31 3-10 8-19 13-28 5-9 11-17 17-23 7-7 15-12 25-16 9-3 20-5 32-5 1 0 5 2 12 6 6 4 13 9 21 14 8 5 18 9 31 13 13 4 25 6 38 6 13 0 25-2 38-6 13-4 23-8 31-13 8-5 15-10 21-14 7-4 11-6 12-6 12 0 23 2 32 5 10 4 18 9 25 16 6 6 12 14 17 23 5 9 10 18 13 28 3 9 5 20 7 31 2 11 3 21 4 31 1 9 1 19 1 29z m-91-255c0 31-11 56-32 78-22 21-48 32-78 32-30 0-56-11-78-32-21-22-32-47-32-78 0-30 11-56 32-77 22-22 48-32 78-32 30 0 56 10 78 32 21 21 32 47 32 77z"/>
      </symbol>
      <symbol viewBox="0 0 24 24" id="ic_close_24px"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </symbol>
    </svg>
    `;
    const div = document.createElement('div');
    div.innerHTML = svgIcons;
    document.body.insertBefore(div, document.body.childNodes[0]);
  }


  return Origo.ui.Component({
    name: 'oidcComponent',
    close,
    onInit() {
      addSvgIcons();
      const menuButtonCls = isExpanded ? ' faded' : '';
      userAvatarButton = Origo.ui.Button({
        icon: menuIcon,
        cls: `control icon-smaller medium round absolute light top-right${menuButtonCls}`,
        style: 'top: 4rem',
        tooltipText: 'Användarmeny',
        tooltipPlacement: 'west',
        click() {
          toggleUserMenu();
        }
      });

      closeButton = Origo.ui.Button({
        cls: 'small round margin-top-small margin-right-small icon-smaller grey-lightest',
        ariaLabel: 'Stäng användare',
        icon: closeIcon,
        click() {
          toggleUserMenu();
        }
      });

      userNameItem = MenuItem({
        title: oidc.getUser().displayname,
        useButton: false
      });

      logoutButton = MenuItem({
        icon: logoutIcon,
        click() {
          oidc.signOut();
        },
        title: 'Logga ut'
      });

      headerComponent = Origo.ui.Element({
        cls: 'flex row justify-end',
        style: { width: '100%' },
        components: [closeButton]
      });

      contentComponent = Origo.ui.Component({
        render() {
          return `<div class="relative width-12"><ul class="padding-y-small" id="${this.getId()}""></ul></div>`;
        },
        components: [userNameItem],
        onAdd() {
          this.addComponent(logoutButton);
        }
      });

      oidcMenu = Origo.ui.Element({
        cls: 'absolute flex column top-right control box bg-white overflow-hidden z-index-top faded',
        collapseX: true,
        style: 'top: 4rem',
        components: [headerComponent, contentComponent]
      });
    },
    onAdd(evt) {
      viewer = evt.target;
      target = document.getElementById(viewer.getMain().getId());
      this.on('render', this.onRender);
      this.addComponents([userAvatarButton, oidcMenu]);
      this.render();
      viewer.getMap().on('click', onMapClick);
    },
    render() {
      //Get menu as html and append as child of the viewer dom element.
      const menuEl = Origo.ui.dom.html(oidcMenu.render());
      target.appendChild(menuEl);

      // Get menu dom node that was just added so Its easily accessible (mostly for menu toggle)
      oidcMenuEl = document.getElementById(oidcMenu.getId());

      // get menu button (avatariconbutton) as html and append as child of viewer element
      const el = Origo.ui.dom.html(userAvatarButton.render());
      target.appendChild(el);

      //get dom node of menu button (avatariconbutton) so its easily accessible
      userAvatarButtonEl = document.getElementById(userAvatarButton.getId());

      //get the username list item as html and append as child of the content-component
      userNameItemEl = Origo.ui.dom.html(userNameItem.render());
      document.getElementById(contentComponent.getId()).appendChild(userNameItemEl);

      //get the login button menu item as html and append as child of the content-component
      logoutButtonEl = Origo.ui.dom.html(logoutButton.render());
      document.getElementById(contentComponent.getId()).appendChild(logoutButtonEl);

      // Dispatch render to the loginbutton so it attaches its eventhandler.
      logoutButton.dispatch('render');

      //Dispatch render on this. Not completely sure why yet but without it the avatar-button doesn't work.
      this.dispatch('render');
    }
  });
};

export default OidcComponent;
