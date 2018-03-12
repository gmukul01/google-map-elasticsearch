let clusterQuery = (bound, zoom) => {
    return {
        query: {
          constant_score: {
            filter: {
              geo_bounding_box: {
                location: bound
              }
            }
          }
        },
        aggs: {
          zoom: {
            geohash_grid: {
              field: "location",
              precision: zoom
            },
            aggs: {
              centroid: {
                geo_centroid: { field: "location" }
              },
              cell: {
                geo_bounds: {
                  field: "location"
                }
              }
            }
          }
        }
      }
};

let investorInfoQuery = (location, count) => {
    return {
      from: 0,
      size: count,
      query: {
        function_score: {
          functions: [
            {
              gauss: {
                location: {
                  origin: location,
                  offset: "10m",
                  scale: "10m"
                }
              },
              weight: 1
            }
          ]
        }
      }
    };
  };

  export {investorInfoQuery, clusterQuery};