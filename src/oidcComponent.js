const OidcComponent = function OidcComponent(oidc) {
  const closeIcon = '#ic_close_24px';
  const menuIcon = '#fa-user';
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

  return Origo.ui.Component({
    name: 'oidcComponent',
    close,
    onInit() {
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
        icon: closeIcon,
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
