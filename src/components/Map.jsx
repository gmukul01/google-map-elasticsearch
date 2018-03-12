import React from "react";
import { compose, withProps, withStateHandlers, withHandlers } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import { isEqual } from "lodash";

import mapStyle from "../resources/json/mapStyle.json";

const MapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={1}
    defaultCenter={{ lat: 25.0391667, lng: 121.525 }}
    defaultOptions={{ styles: mapStyle }}
    ref={props.mapRef}
    onZoomChanged={props.onZoomChanged}
    onDrag={props.onDrag}
  >
    {props.markers.map(investor => (
      <Marker
        icon="https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m2.png"
        position={investor.location}
        key={investor.key}
        label={String(investor.count)}
        onClick={() =>
          props.onMarkerClick(investor.key, investor.bounds, investor.count)
        }
      >
        {props.locationKey === investor.key && (
          <InfoWindow onCloseClick={props.resetInfoLocation}>
            <ul>
              {props.investorsInfo.map(investor => (
                <li key = {investor._source.Firm_ID}>
                  <a href="" target="_blank">
                    {investor._source.Investor}
                  </a>
                </li>
              ))}
            </ul>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));

export default MapComponent;
