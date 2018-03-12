import React from "react";
import MapComponent from "./Map";
import axios from "axios";
import geohash from "ngeohash";
import {isEqual} from 'lodash';

import {clusterQuery,investorInfoQuery} from '../util/elasticSearchQueries';
import {getZoom,googleToElasticBound} from '../util/helper'

export default class MapWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      locationKey:"",
      investorsInfo:[]
    };
    this.onClick = this.onClick.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onZoomChanged = this.onZoomChanged.bind(this);
    this.resetInfoLocation = this.resetInfoLocation.bind(this);
    this.fetchData = this.fetchData.bind(this);;
    this.fetchInvestorsInfo = this.fetchInvestorsInfo.bind(this);;
  }

  onClick(key, bounds, count) {
   if(isEqual(bounds.top_left,bounds.bottom_right))
        this.fetchInvestorsInfo(key, bounds.top_left, count)
    else{
        this.map.fitBounds({south: bounds.bottom_right.lat, west: bounds.top_left.lon, north: bounds.top_left.lat, east: bounds.bottom_right.lon});
        this.fetchData(bounds, getZoom(this.map))
    }
  }

  onDrag() {
    let bounds = googleToElasticBound(this.map);
    this.fetchData(bounds, getZoom(this.map))
  }

  onZoomChanged() {
    let bounds = googleToElasticBound(this.map);
    this.fetchData(bounds, getZoom(this.map))
  }

  resetInfoLocation() {
      this.setState(() => ({ locationKey:"",investorsInfo:[]}))
  }

  componentDidMount() {
    let initialBound = {
        top_left: {
          lat: 89.8421608764195,
          lon: -180
        },
        bottom_right: {
          lat: -89.8421608764195,
          lon: 180
        }
      }
    this.fetchData(initialBound, 1);
  }

  fetchData(bound, zoom) {
    axios({
        url: `http://localhost:9200/investor_data/_search`,
        method: "post",
        data: clusterQuery(bound,zoom)
      })
        .then(response => {
          let markers = response.data.aggregations.zoom.buckets.map(cluster => {
            let marker = {};
            marker["location"] = {
              lat: Number(cluster.centroid.location.lat),
              lng: Number(cluster.centroid.location.lon)
            };
            marker["key"] = cluster.key;
            marker["count"] = cluster.doc_count;
            marker["bounds"] = cluster.cell.bounds;
            return marker;
          });
          this.setState(() => ({ markers }));
        })
        .catch(err => console.log("Error ->", err));
  }

  fetchInvestorsInfo(key, location, count) {
    axios({
        url: `http://localhost:9200/investor_data/_search`,
        method: "post",
        data: investorInfoQuery(location,count)
      })
        .then(response => {
            this.setState(() => ({ investorsInfo: response.data.hits.hits, locationKey:key }));
        })
        .catch(err => console.log("Error ->", err));
  }

  render() {
    return <MapComponent {...this.state} resetInfoLocation={this.resetInfoLocation} onMarkerClick = {(key, bounds, count) => this.onClick(key, bounds, count)}  onZoomChanged = {this.onZoomChanged} onDrag = {this.onDrag} mapRef = {map => this.map = map}/>;
  }
}
