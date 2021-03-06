import * as React from 'react';
import { SharedRenderProps } from '../types';
import { isEmptyChildren } from '../utils';

export interface GeoPositionProps {
  isLoading: boolean;
  coords?: {
    longitude: number;
    latitude: number;
  };
  error?: PositionError;
}

export class GeoPosition extends React.Component<
  SharedRenderProps<{}>,
  GeoPositionProps
> {
  geoId: any;

  state = {
    isLoading: true,
  };

  componentDidMount() {
    this.requestGeo();
  }

  requestGeo = () => {
    this.setState({ isLoading: true });
    this.geoId = navigator.geolocation.getCurrentPosition(
      (position: Position) =>
        this.setState({
          isLoading: false,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: undefined,
        }),
      (error: PositionError) => this.setState({ error, isLoading: false })
    );
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.geoId);
  }

  render() {
    const { render, component, children, ...props } = this.props;
    return component
      ? React.createElement(component as any, props)
      : render
        ? (render as any)(props)
        : children // children come last, always called
          ? typeof children === 'function'
            ? children(this.state)
            : !isEmptyChildren(children) ? React.Children.only(children) : null
          : null;
  }
}
