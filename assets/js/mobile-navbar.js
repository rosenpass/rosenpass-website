// Requires these properties to be made available at the end of bootstrap.bundle.js' in the
// index_umd object:
// BaseComponent,
// EventHandler,
// SelectorEngine,
// Backdrop,
// FocusTrap,
// ScrollBarHelper,
// isVisible,
// isDisabled,
// enableDismissTrigger,
// defineJQueryPlugin

// Should look like this:
// const index_umd = {
//   Alert,
//   Button,
//   Carousel,
//   Collapse,
//   Dropdown,
//   Modal,
//   Offcanvas,
//   Popover,
//   ScrollSpy,
//   Tab,
//   Toast,
//   Tooltip,
//   BaseComponent,
//   EventHandler,
//   SelectorEngine,
//   Backdrop,
//   FocusTrap,
//   ScrollBarHelper,
//   isVisible,
//   isDisabled,
//   enableDismissTrigger,
//   defineJQueryPlugin
// };

// return index_umd;


// (() => {
    'use strict';
  
    const {
      BaseComponent,
      EventHandler,
      SelectorEngine,
      Backdrop,
      FocusTrap,
      ScrollBarHelper,
      isVisible,
      isDisabled,
      enableDismissTrigger,
      defineJQueryPlugin
    } = bootstrap;



    const NAME$s99 = 'mobileNavMenu';
    const DATA_KEY$s99 = 'bs.mobileNavMenu';
    const EVENT_KEY$s99 = `.${DATA_KEY$s99}`;
    const DATA_API_KEY$s99 = '.data-api';
    const EVENT_LOAD_DATA_API$s99 = `load${EVENT_KEY$s99}${DATA_API_KEY$s99}`;
    const ESCAPE_KEY$s99 = 'Escape';
    const CLASS_NAME_SHOW$s99 = 'show';
    const CLASS_NAME_SHOWING$s99 = 'showing';
    const CLASS_NAME_HIDING$s99 = 'hiding';
    const CLASS_NAME_BACKDROP$s99 = 'mobileNav-backdrop';
    const OPEN_SELECTOR$s99 = '.mobileNav.show';
    const EVENT_SHOW$s99 = `show${EVENT_KEY$s99}`;
    const EVENT_SHOWN$s99 = `shown${EVENT_KEY$s99}`;
    const EVENT_HIDE$s99 = `hide${EVENT_KEY$s99}`;
    const EVENT_HIDE_PREVENTED$s99 = `hidePrevented${EVENT_KEY$s99}`;
    const EVENT_HIDDEN$s99 = `hidden${EVENT_KEY$s99}`;
    const EVENT_RESIZE$s99 = `resize${EVENT_KEY$s99}`;
    const EVENT_CLICK_DATA_API$s99 = `click${EVENT_KEY$s99}${DATA_API_KEY$s99}`;
    const EVENT_TOUCH_DATA_API$s99 = `touchend${EVENT_KEY$s99}${DATA_API_KEY$s99}`;
    const EVENT_KEYDOWN_DISMISS$s99 = `keydown.dismiss${EVENT_KEY$s99}`;
    const SELECTOR_DATA_TOGGLE$s99 = '[data-bs-toggle="mobileNavMenu"]';
    const SELECTOR_DATA_TOGGLE_BACK$s99 = '[data-bs-toggle="mobileNavMenu-back"]';
    let touchStartX = 0;
    let touchEndX = 0;
    const Default$s99 = {
      backdrop: true,
      keyboard: true,
      scroll: false
    };
    const DefaultType$s99 = {
      backdrop: '(boolean|string)',
      keyboard: 'boolean',
      scroll: 'boolean'
    };
  
    class MobileNavMenu extends BaseComponent {
      constructor(element, config) {
        super(element, config);
        this._isShown = false;
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
        this._addEventListeners();
      }
  
      static get Default() {
        return Default$s99;
      }
  
      static get DefaultType() {
        return DefaultType$s99;
      }
  
      static get NAME() {
        return NAME$s99;
      }
      
      toggle(relatedTarget) {
        const parentMobileNavMenu = SelectorEngine.find('.mobileNav.mobileNav-end:has(#mobileNavMenu-Active)');
        for (let i = 0; i < parentMobileNavMenu.length; i++) {
          let ele = parentMobileNavMenu[i];
          if ( i == 0 ){
            MobileNavMenu.getOrCreateInstance(ele).show()  
          } else {
            let instance = MobileNavMenu.getOrCreateInstance(ele)
            instance._element.classList.add("mobile-nav-layers-showing");
            instance.show();
            instance._element.classList.remove("mobile-nav-layers-showing");
          }
        }
        this._element.classList.add("mobile-nav-layers-showing");
        this.show(relatedTarget);
        this._element.classList.remove("mobile-nav-layers-showing");
      }
  
      show(relatedTarget) {
        if (this._isShown) {
            return;
        }
        
        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$s99, { relatedTarget });
        if (showEvent.defaultPrevented) {
            return;
        }
  
        this._isShown = true;
        this._backdrop.show();
  
        if (!this._config.scroll) {
            new ScrollBarHelper().hide();
        }
  
        this._element.setAttribute('aria-modal', true);
        this._element.setAttribute('role', 'dialog');
        this._element.classList.add(CLASS_NAME_SHOWING$s99);
  
        const completeCallBack = () => {
            if (!this._config.scroll || this._config.backdrop) {
                this._focustrap.activate();
            }
            this._element.classList.add(CLASS_NAME_SHOW$s99);
            this._element.classList.remove(CLASS_NAME_SHOWING$s99);
            EventHandler.trigger(this._element, EVENT_SHOWN$s99, { relatedTarget });
        };
  
        this._queueCallback(completeCallBack, this._element, true);
      }
  
      hide() {
        if (!this._isShown) {
          return;
        }
        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$s99);
        if (hideEvent.defaultPrevented) {
          return;
        }
        this._focustrap.deactivate();
        this._element.blur();
        this._isShown = false;
        this._element.classList.add(CLASS_NAME_HIDING$s99);
        this._backdrop.hide();
        const completeCallback = () => {
          this._element.classList.remove(CLASS_NAME_SHOW$s99, CLASS_NAME_HIDING$s99);
          this._element.removeAttribute('aria-modal');
          this._element.removeAttribute('role');
          if (!this._config.scroll) {
            new ScrollBarHelper().reset();
          }
          EventHandler.trigger(this._element, EVENT_HIDDEN$s99);
        };
        this._queueCallback(completeCallback, this._element, true);
      }
  
      hideAll() {
        const allOpen = SelectorEngine.find(OPEN_SELECTOR$s99);
          allOpen.reverse()
        for (let i = 0; i < allOpen.length; i++) {
          let ele = MobileNavMenu.getInstance(allOpen[i]);
          if (i == allOpen.length - 1){
            ele.hide();
          } else {
            ele._element.classList.add("mobile-nav-layers");
            ele.hide();
            ele._element.classList.remove("mobile-nav-layers");
          }
        }
      }
  
      dispose() {
        this._backdrop.dispose();
        this._focustrap.deactivate();
        super.dispose();
      }
  
      _initializeBackDrop() {
        const clickCallback = () => {
          if (this._config.backdrop === 'static') {
            EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$s99);
            return;
          }
          this.hide();
        };
  
        const isVisible = Boolean(this._config.backdrop);
        return new Backdrop({
          className: CLASS_NAME_BACKDROP$s99,
          isVisible,
          isAnimated: true,
          rootElement: this._element.parentNode,
          clickCallback: isVisible ? clickCallback : null
        });
      }
  
      _initializeFocusTrap() {
        return new FocusTrap({
          trapElement: this._element
        });
      }
  
      _addEventListeners() {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$s99, event => {
          if (event.key !== ESCAPE_KEY$s99) {
            return;
          }
          if (this._config.keyboard) {
            this.hide();
            return;
          }
          EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$s99);
        });
      }

      static jQueryInterface(config) {
        return this.each(function () {
          const data = MobileNavMenu.getOrCreateInstance(this, config);
          if (typeof config !== 'string') {
            return;
          }
          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
            throw new TypeError(`No method named "${config}"`);
          }
          data[config](this);
        });
      }
    }
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$s99, SELECTOR_DATA_TOGGLE$s99, function (event) {
      const target = SelectorEngine.getElementFromSelector(this);
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      if (isDisabled(this)) {
        return;
      }
      EventHandler.one(target, EVENT_HIDDEN$s99, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
      const data = MobileNavMenu.getOrCreateInstance(target);
      data.toggle(this);
    });
  
    EventHandler.on(window, EVENT_LOAD_DATA_API$s99, () => {
      for (const selector of SelectorEngine.find(OPEN_SELECTOR$s99)) {
        MobileNavMenu.getOrCreateInstance(selector).show();
      }
    });
  
    EventHandler.on(window, EVENT_RESIZE$s99, () => {
      for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=mobileNav-]')) {
        if (getComputedStyle(element).position !== 'fixed') {
          MobileNavMenu.getOrCreateInstance(element).hide();
        }
      }
    });
  
    EventHandler.on(document, EVENT_CLICK_DATA_API$s99, SELECTOR_DATA_TOGGLE_BACK$s99, function (event) {
      const target = SelectorEngine.getElementFromSelector(this);
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      if (isDisabled(this)) {
        return;
      }
      EventHandler.one(target, EVENT_HIDDEN$s99, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
      const data = MobileNavMenu.getOrCreateInstance(target);
      data.hide(this);
    });

    EventHandler.on(document, 'touchstart', function (event){
        touchStartX = 0;
        touchStartX = event.touches[0].clientX;
    });
      EventHandler.on(document, 'touchend', function (event){
        touchEndX = 0;
        touchEndX = event.changedTouches[0].clientX;
        if (Math.abs(touchStartX - touchEndX) > 100) {
        const target = document.querySelector('.mobileNav.mobileNav-end#mobileNavMenu-Active');
        if (!target) return;
        const data = MobileNavMenu.getOrCreateInstance(target);
        if (touchStartX - touchEndX > 100) {
            data.toggle();
        }
        else if (touchEndX - touchStartX > 100) {
            data.hideAll();
        }
        }
    });
    enableDismissTrigger(MobileNavMenu, 'hideAll');
    defineJQueryPlugin(MobileNavMenu);
  // })();
  