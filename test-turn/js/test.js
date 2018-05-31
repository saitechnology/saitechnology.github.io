/*
 * (C) Copyright 2018 SAI Technology Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
 
 
 /* eslint-env node */

'use strict';
// This is a basic test file for use with testling.
// The test script language comes from tape.
var test = require('tape');

var webdriver = require('selenium-webdriver');
var seleniumHelpers = require('webrtc-utilities').seleniumLib;

test('Candidate Gathering', function(t) {
  var driver = seleniumHelpers.buildDriver();

  driver.get((process.env.BASEURL ? process.env.BASEURL :
      ('file://' + process.cwd())) +
      '/src/content/peerconnection/trickle-ice/index.html')
  .then(function() {
    t.pass('page loaded');
    return driver.findElement(webdriver.By.id('gather')).click();
  })
  .then(function() {
    return driver.wait(function() {
      return driver.executeScript(
          'return pc === null && candidates.length > 0;');
    }, 30 * 1000);
  })
  .then(function() {
    t.pass('got candidates');
    t.end();
  })
  .then(null, function(err) {
    t.fail(err);
    t.end();
  });
});

// Skipping. webdriver.ActionSequence is not implemented in
// marionette/geckodriver hence we cannot double click the server option
// menu without hacks.
test('Loading server data', {skip: process.env.BROWSER === 'firefox'},
  function(t) {
    var driver = seleniumHelpers.buildDriver();

    driver.get((process.env.BASEURL ? process.env.BASEURL :
        ('file://' + process.cwd())) +
        '/src/content/peerconnection/trickle-ice/index.html')
    .then(function() {
      t.pass('page loaded');
      return driver.findElement(webdriver.By.css('#servers>option'));
    })
    .then(function(element) {
      return new webdriver.ActionSequence(driver).
          doubleClick(element).perform();
    })
    .then(function() {
      return driver.findElement(webdriver.By.id('url')).getAttribute('value');
    })
    .then(function(value) {
      t.ok(value !== '', 'doubleclick loads server data');
      t.end();
    })
    .then(null, function(err) {
      t.fail(err);
      t.end();
    });
  });


// Disabling on firefox until sendKeys is fixed.
// https://github.com/mozilla/geckodriver/issues/683
test('Adding a server', {skip: process.env.BROWSER === 'firefox'},
  function(t) {
    var driver = seleniumHelpers.buildDriver();

    driver.get((process.env.BASEURL ? process.env.BASEURL :
        ('file://' + process.cwd())) +
        '/src/content/peerconnection/trickle-ice/index.html')
    .then(function() {
      t.pass('page loaded');
      return driver.findElement(webdriver.By.id('url'))
          .sendKeys('stun:stun.l.google.com:19302');
    })
    .then(function() {
      t.pass('url input worked');
      return driver.findElement(webdriver.By.id('add')).click();
    })
    .then(function() {
      return driver.findElement(webdriver.By.css('#servers'))
          .getAttribute('length');
    })
    .then(function(length) {
      t.ok(length === '2', 'server added');
      t.end();
    })
    .then(null, function(err) {
      t.fail(err);
      t.end();
    });
  });

test('Removing a server', {skip: process.env.BROWSER === 'firefox'},
  function(t) {
    var driver = seleniumHelpers.buildDriver();

    driver.get((process.env.BASEURL ? process.env.BASEURL :
        ('file://' + process.cwd())) +
        '/src/content/peerconnection/trickle-ice/index.html')
    .then(function() {
      t.pass('page loaded');
      return driver.findElement(webdriver.By.css('#servers>option')).click();
    })
    .then(function() {
      return driver.findElement(webdriver.By.id('remove')).click();
    })
    .then(function() {
      return driver.findElement(webdriver.By.css('#servers'))
          .getAttribute('length');
    })
    .then(function(length) {
      t.ok(length === '0', 'server removed');
      t.end();
    })
    .then(null, function(err) {
      t.fail(err);
      t.end();
    });
  });
