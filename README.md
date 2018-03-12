If you want to fetch too much of data on google in just few seconds then you are at right github page.

Problem
If we do clustering on client side then we have to fetch all the data and give it to google map to cluster.
It takes sufficient time to fetch all data.

Solution
Do clustering on serverside using elasticsearch.

Query to do clustering in elasticsearch.

        {
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
