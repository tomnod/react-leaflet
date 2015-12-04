/* eslint-disable react/no-did-mount-set-state */

import isArray from 'lodash/lang/isArray';
import isUndefined from 'lodash/lang/isUndefined';
// import uniqueId from 'lodash/utility/uniqueId';

import React, { PropTypes } from 'react';
import Leaflet from 'leaflet';

import boundsType from './types/bounds';
import latlngType from './types/latlng';

import MapComponent from './MapComponent';

const normalizeCenter = pos => isArray(pos) ? pos : [pos.lat, pos.lng || pos.lon];

export default class Map extends MapComponent {
  static propTypes = {
    bounds: boundsType,
    boundsOptions: PropTypes.object,
    center: latlngType,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    className: PropTypes.string,
    id: PropTypes.string,
    maxBounds: boundsType,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    style: PropTypes.object,
    zoom: PropTypes.number,
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     id: props.id || uniqueId('map'),
  //   };
  // }

  componentWillMount() {
    this.element = React.createElement('div', {
      className: this.props.className,
      style: this.props.style,
    });
    this.leafletElement = Leaflet.map(this.element, this.props);
  }

  componentDidMount() {
    // this.leafletElement = Leaflet.map(this.state.id, this.props);
    super.componentDidMount();
    // this.setState({map: this.leafletElement});
    if (!isUndefined(this.props.bounds)) {
      this.leafletElement.fitBounds(this.props.bounds, this.props.boundsOptions);
    }
  }

  componentDidUpdate(prevProps) {
    const { bounds, center, maxBounds, zoom } = this.props;
    if (center && this.shouldUpdateCenter(center, prevProps.center)) {
      this.leafletElement.setView(center, zoom, {animate: false});
    }
    else if (zoom && zoom !== prevProps.zoom) {
      this.leafletElement.setZoom(zoom);
    }
    if (maxBounds && this.shouldUpdateBounds(maxBounds, prevProps.maxBounds)) {
      this.leafletElement.setMaxBounds(maxBounds);
    }
    if (bounds && this.shouldUpdateBounds(bounds, prevProps.bounds)) {
      this.leafletElement.fitBounds(bounds, this.props.boundsOptions);
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.leafletElement.remove();
  }

  shouldUpdateCenter(next, prev) {
    if (!prev) return true;
    next = normalizeCenter(next);
    prev = normalizeCenter(prev);
    return next[0] !== prev[0] || next[1] !== prev[1];
  }

  shouldUpdateBounds(next, prev) {
    if (!prev) return true;
    next = Leaflet.latLngBounds(next);
    prev = Leaflet.latLngBounds(prev);
    return !next.equals(prev);
  }

  render() {
    React.Children.forEach(this.props.children, (child) => child.setProps({map: this.leafletElement}));

    return this.element;
  }
}
