/**
 * @author Andrei Preda
 * Unit test around node/browserify usage of the module not the actual marker functionality
 * The original module: https://github.com/googlemaps/js-marker-clusterer
 */

'use strict';

var expect = require('chai').expect;
var leche = require('leche');
var MarkerClusterer = require('./../src/markerclusterer');

var markerclustererInstance = null;

describe('node-js-marker-clusterer', function () {

  before(function () {
    //mocks google maps
    global.google = leche.create(['maps']);
    global.map = leche.create(['getZoom']);
    global.google.maps = leche.create(['OverlayView']);
    global.google.maps.event = leche.create(['addListener']);

    markerclustererInstance = new MarkerClusterer(global.map);
  });

  it('Initialises a new MarkerClusterer', function () {
    expect(markerclustererInstance).to.exist;
    expect(markerclustererInstance).to.be.an.instanceOf(MarkerClusterer);
  });

  it('Assigns a global variable MarkerClusterer', function () {
    expect(global.MarkerClusterer).to.exist;
  });

  //public methods
  it('Has an "extend" instance method', function () {
    expect(markerclustererInstance).to.respondTo('extend');
  });

  it('Has an "repaint" instance method', function () {
    expect(markerclustererInstance).to.respondTo('repaint');
  });

  it('Has an "resetViewport" instance method', function () {
    expect(markerclustererInstance).to.respondTo('resetViewport');
  });

  it('Has an "clearMarkers" instance method', function () {
    expect(markerclustererInstance).to.respondTo('clearMarkers');
  });

  it('Has an "getExtendedBounds" instance method', function () {
    expect(markerclustererInstance).to.respondTo('getExtendedBounds');
  });

  it('Has an "setMinClusterSize" instance method', function () {
    expect(markerclustererInstance).to.respondTo('setMinClusterSize');
  });

  it('Has an "getMinClusterSize" instance method', function () {
    expect(markerclustererInstance).to.respondTo('getMinClusterSize');
  });

  it('Has an "setGridSize" instance method', function () {
    expect(markerclustererInstance).to.respondTo('setGridSize');
  });

  it('Has an "getGridSize" instance method', function () {
    expect(markerclustererInstance).to.respondTo('getGridSize');
  });

  it('Has an "setMap" instance method', function () {
    expect(markerclustererInstance).to.respondTo('setMap');
  });

  it('Has an "getMap" instance method', function () {
    expect(markerclustererInstance).to.respondTo('getMap');
  });

  it('Has an "getTotalClusters" instance method', function () {
    expect(markerclustererInstance).to.respondTo('getTotalClusters');
  });

  it('Has an "removeMarkers" instance method', function () {
    expect(markerclustererInstance).to.respondTo('removeMarkers');
  });

  it('Has an "removeMarker" instance method', function () {
    expect(markerclustererInstance).to.respondTo('removeMarker');
  });

  it('Has an "addMarker" instance method', function () {
    expect(markerclustererInstance).to.respondTo('addMarker');
  });

  it('Has an "addMarkers" instance method', function () {
    expect(markerclustererInstance).to.respondTo('addMarkers');
  });

  it('Has an "setCalculator" instance method', function () {
    expect(markerclustererInstance).to.respondTo('setCalculator');
  });

  it('Has an "getMaxZoom" instance method', function () {
    expect(markerclustererInstance).to.respondTo('getMaxZoom');
  });

  it('Has an "setMaxZoom" instance method', function () {
    expect(markerclustererInstance).to.respondTo('setMaxZoom');
  });

  it('Has an "getTotalMarkers" instance method', function () {
    expect(markerclustererInstance).to.respondTo('getTotalMarkers');
  });

  it('Has an "getMarkers" instance method', function () {
    expect(markerclustererInstance).to.respondTo('getMarkers');
  });

  it('Has an "isAverageCenter" instance method', function () {
    expect(markerclustererInstance).to.respondTo('isAverageCenter');
  });

  it('Has an "isZoomOnClick" instance method', function () {
    expect(markerclustererInstance).to.respondTo('isZoomOnClick');
  });

  it('Has an "getStyles" instance method', function () {
    expect(markerclustererInstance).to.respondTo('getStyles');
  });

  it('Has an "setStyles" instance method', function () {
    expect(markerclustererInstance).to.respondTo('setStyles');
  });

  it('Has an "fitMapToMarkers" instance method', function () {
    expect(markerclustererInstance).to.respondTo('fitMapToMarkers');
  });

  it('Has an "onAdd" instance method', function () {
    expect(markerclustererInstance).to.respondTo('onAdd');
  });

  it('Has an "draw" instance method', function () {
    expect(markerclustererInstance).to.respondTo('draw');
  });

});
