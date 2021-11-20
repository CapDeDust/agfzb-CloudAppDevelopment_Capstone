#
#
# main() will be run when you invoke this action
#
# @param Cloud Functions actions accept a single parameter, which must be a JSON object.
#
# @return The output of this action, which must be a JSON object.
#
#
from cloudant.client import Cloudant
from cloudant.error import CloudantException
import sys
import requests
import json
    
def main(dict):
    aList = []
    try:
        client = Cloudant.iam(
            account_name=dict['cloudant_username'],
            api_key=dict['cloudant_apikey'],
            connect=True,
        )
        my_database = client['reviews']
        for doc in my_database:
            print(dict)
            if "dealerId" in dict:
                if dict["dealerId"] == doc["id"]:
                    aList.append(doc)
            
    except CloudantException as ce:
        print("unable to connect")
        return {"error": ce}
    except (requests.exceptions.RequestException, ConnectionResetError) as err:
        print("connection error")
        return {"error": err}
    
    if len(aList) < 1:
        return { "error": "dealerId does not exist" }

    print(aList)
    return { "reviews": aList }
