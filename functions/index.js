/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
 const Cloudant = require('@cloudant/cloudant');
  
 async function main(params) {
     const cloudant = Cloudant({
         url: params.cloudant_url,
         plugins: { iamauth: { iamApiKey: params.cloudant_apikey } }
     });
 
     try {
         let dbList = await cloudant.db.use("dealerships");
         dbList.list({include_docs: true});
         
         let q;
         let response;
         if (params.state) {
             q = {
                 selector: {
                 _id: { "$gt": "0"},
                 st: {"$eq": params.state }
                 },
                 fields: [ "id", "city", "state", "st", "address", "zip", "lat", "long" ]
             };
             response = await dbList.find(q);
             if (response.bookmark === 'nil') {
                 return { 
                     "headers": { 
                         "Content-Type": "application/json" 
                         
                     }, 
                     "statusCode": "404", 
                     "error": "The state does not exist"
                 }
             }
         } else {
             q = {
                 selector: {
                 _id: { "$gt": "0"}
                 },
                 fields: [ "id", "city", "state", "st", "address", "zip", "lat", "long" ]
             };
             response = await dbList.find(q);
         }
         
         return response;
     } catch (error) {
         return { error: error.description };
     }    
 }
