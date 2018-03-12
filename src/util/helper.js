let getZoom = (map) => {
    var zoom = 1;
    if(map.getZoom() >= 2 && map.getZoom() <= 4){
        zoom =2;
    }
    if(map.getZoom() >= 5 && map.getZoom() <= 8){
        zoom =4;
    }
    else if(map.getZoom() >= 9 && map.getZoom() <= 11){
        zoom =5;
    }
    else if(map.getZoom() >= 12 && map.getZoom() <= 14){
        zoom =6;
    }
    else if(map.getZoom() >= 15 && map.getZoom() <= 17){
        zoom =7;
    }
    else if(map.getZoom() >= 18){
        zoom =8;
    }
    return zoom;
  }

  let googleToElasticBound = (map) => {
   return  {
        "top_left": {
            "lat": map.getBounds().getNorthEast().lat(),
            "lon": map.getBounds().getSouthWest().lat()
          },
          "bottom_right": {
            "lat": map.getBounds().getSouthWest().lat(),
            "lon": map.getBounds().getNorthEast().lng()
          }
    }
  }

  export {getZoom, googleToElasticBound}