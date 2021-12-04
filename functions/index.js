function main(params) {
  return new Promise(function (resolve, reject) {
    const Cloudant = require("@cloudant/cloudant");

    const cloudant = Cloudant({
      url: params.cloudant_url,
      plugins: { iamauth: { iamApiKey: params.cloudant_apikey } },
    });

    const dealershipDb = cloudant.use("dealerships");
    if (params.state) {
      // return dealership with this state
      dealershipDb.find(
        {
            selector: {
                _id: { "$gt": "0"},
                st: { "$eq": params.state }
            },
            fields: [ "id", "city", "state", "st", "address", "zip", "lat", "long", "short_name", "full_name" ]
        },
        
        function (err, result) {
          if (err) {
            reject(err);
          }

          let code = 200;

          if (result.docs.length == 0) {
            result.error = "No matching state found with that abbreviation";
            code = 404;
          }

          resolve({
            statusCode: code,
            headers: { "Content-Type": "application/json" },
            body: result,
          });
        }
      );
    } else if (params.id) {
      id = parseInt(params.dealerId);
      // return dealership with this state
      dealershipDb.find(
          {
            selector: {
                id: { "$eq": parseInt(params.id) }
            },
            fields: [ "id", "city", "state", "st", "address", "zip", "lat", "long", "short_name", "full_name" ]
        },
        
        function (err, result) {
          if (err) {
            reject(err);
          }

          let code = 200;

          if (result.docs.length == 0) {
            code = 404;
            result.error = "No matching state found with that id";
          }
          resolve({
            statusCode: code,
            headers: { "Content-Type": "application/json" },
            body: result,
          });
        }
      );
    } else {
      // return all documents
      dealershipDb.find({ 
          selector: {
            _id: { "$gt": "0"}
          },
          fields: [ "id", "city", "state", "st", "address", "zip", "lat", "long", "short_name", "full_name" ]
      }, function (err, result) {
        if (err) {
          reject(err);
        }

        resolve({
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: result,
        });
      });
    }
  });
}
