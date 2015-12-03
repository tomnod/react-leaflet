import { PropTypes } from 'react';
import { Map, geoJson } from 'leaflet';

import Path from './Path';

export default class GeoJson extends Path {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  static contextTypes = {
    map: PropTypes.instanceOf(Map)
  };

  componentWillMount() {
    super.componentWillMount();
    const { data, map, ...props } = this.props;
    this.leafletElement = geoJson(data, props);
  }

  componentDidUpdate(prevProps) {
    this.setStyleIfChanged(prevProps, this.props);
  }

  render() {
    if (typeof(this.props.ref) == 'function') {
      this.props.ref(this.leafletElement);
    }
    return
  }
}
