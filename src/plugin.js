import document from 'global/document';
import window from 'global/window';
import videojs from 'video.js';
import {version as VERSION} from '../package.json';

// Default options for the plugin.
const defaults = {};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  // player.addClass('vjs-social-media');
  const links = options.links;
  const Component = videojs.getComponent('Component');
  const menuLinks = new Component(player);
  const CompButton = new Component(player);

  // Create Button
  const button = CompButton.createEl('div', {
    className: 'vjs-button-social'
  });

  button.addEventListener('click', (e) => {
    const el = document.getElementsByClassName('vjs-menu-social')[0];

    button.classList.toggle('open');
    el.classList.toggle('show');
    e.stopPropagation();
  });

  button.addEventListener('touchend', (e) => {
    e.stopPropagation();
  });

  // Create Menu
  const menu = menuLinks.createEl('div', {
    className: 'vjs-menu-social'
  });

  menu.addEventListener('touchend', (e) => {
    e.stopPropagation();
  });

  for (const elem of links) {
    createComponentSocial(elem);
  }

  /**
   * Function to invoke when the player is ready.
   *
   * @function createComponentSocial
   * @param    {json} elem
   *           json element object.
   */
  function createComponentSocial(elem) {
    const item = new Component(player).createEl('span', {
      className: 'vjs-icon-' + elem.name
    });

    let url = '';

    switch (elem.name) {
    case 'facebook':
      url = 'http://www.facebook.com/sharer.php?u=' + elem.url;

      if (typeof elem.title !== 'undefined') {
        url += '&title=' + elem.title;
      }

      if (typeof elem.summary !== 'undefined') {
        url += '&summary=' + elem.summary;
      }

      break;

    case 'gplus':
      url = 'https://plus.google.com/share?url=' + elem.url;
      break;

    case 'tumblr':
      url = 'http://tumblr.com/widgets/share/tool?canonicalUrl=' + elem.url;
      break;

    case 'pinterest':
      url = 'https://pinterest.com/pin/create/button/?url=' + elem.url;

      if (typeof elem.summary !== 'undefined') {
        url += '&description=' + elem.summary;
      }

      break;
    case 'twitter':
      url = 'https://twitter.com/intent/tweet?url=' + elem.url;

      if (typeof elem.text !== 'undefined') {
        url += '&text=' + elem.text;
      }

      if (typeof elem.via !== 'undefined') {
        url += '&via=' + elem.via;
      }

      if (typeof elem.related !== 'undefined') {
        url += '&related=' + elem.related;
      }

      if (typeof elem.hashtags !== 'undefined') {
        url += '&hashtags=' + elem.hashtags;
      }

      break;
    case 'linkedin':
      url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + elem.url;

      if (typeof elem.title !== 'undefined') {
        url += '&title=' + elem.title;
      }

      if (typeof elem.summary !== 'undefined') {
        url += '&summary=' + elem.summary;
      }

      break;
    }
    // window.open(encodeURIComponent(url));
    item.addEventListener('click', () => window.open(url));

    menu.appendChild(item);
  }

  menuLinks.el_ = menu;
  CompButton.el_ = button;

  player.addChild(menuLinks);
  player.addChild(CompButton);

};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function socialMedia
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const socialMedia = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
registerPlugin('socialMedia', socialMedia);

// Include the version number.
socialMedia.VERSION = VERSION;

export default socialMedia;
