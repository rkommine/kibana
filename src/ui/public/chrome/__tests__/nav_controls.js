import ngMock from 'ngMock';
import $ from 'jquery';
import expect from 'expect.js';

import uiModules from 'ui/modules';
import chromeNavControlsRegistry from 'ui/registry/chrome_nav_controls';
import Registry from 'ui/registry/_registry';

describe('chrome nav controls', function () {
  let compile;
  let stubRegistry;

  beforeEach(ngMock.module('kibana', function (PrivateProvider) {
    stubRegistry = new Registry({
      order: ['order']
    });

    PrivateProvider.swap(chromeNavControlsRegistry, stubRegistry);
  }));

  beforeEach(ngMock.inject(function ($compile, $rootScope) {
    compile = function () {
      const $el = $('<div kbn-chrome-append-nav-controls>');
      $rootScope.$apply();
      $compile($el)($rootScope);
      return $el;
    };
  }));

  it('injects templates from the ui/registry/chrome_nav_controls registry', function () {
    stubRegistry.register(function () {
      return {
        name: 'control',
        order: 100,
        template: `<span id="testTemplateEl"></span>`
      };
    });

    var $el = compile();
    expect($el.find('#testTemplateEl')).to.have.length(1);
  });

  it('renders controls in order', function () {
    stubRegistry.register(function () {
      return {
        name: 'control2',
        order: 2,
        template: `<span id="2", class="testControl"></span>`
      };
    });
    stubRegistry.register(function () {
      return {
        name: 'control1',
        order: 1,
        template: `<span id="1", class="testControl"></span>`
      };
    });
    stubRegistry.register(function () {
      return {
        name: 'control3',
        order: 3,
        template: `<span id="3", class="testControl"></span>`
      };
    });

    var $el = compile();
    expect(
      $el.find('.testControl')
      .toArray()
      .map(el => el.id)
    ).to.eql(['1', '2', '3']);
  });
});