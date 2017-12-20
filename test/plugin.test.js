import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-social-media', {

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.expect(2);

  assert.strictEqual(
    typeof Player.prototype.socialMedia,
    'function',
    'videojs-social-media plugin was registered'
  );

  this.player.socialMedia({links:[
    {
      label: "facebook",
      class: "vjs-icon-facebook",
      handleClick: function () {
        console.log('click facebook');
        //window.open('http://www.facebook.com/sharer.php?u=http://www.guiarte.com/');
      }
    },
    {
      label: "twitter",
      class: "vjs-icon-twitter",
      handleClick: function () {
        console.log('click twitter');
        //window.open('http://www.facebook.com/sharer.php?u=http://www.guiarte.com/');
      }
    }
  ]});

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(2);

  assert.ok(
    this.player.hasClass('vjs-social-media'),
    'the plugin adds a class to the player'
  );
});
