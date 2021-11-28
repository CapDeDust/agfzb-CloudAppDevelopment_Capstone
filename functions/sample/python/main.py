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
    dealerId = dict.get('dealerId')
    if(dealerId is None):
        return { 'message': 'dealerId is required', 'statusCode': 404 }
    
    aList = []

    try:
        client = Cloudant.iam(
            account_name = dict['cloudant_username'],
            api_key = dict['cloudant_apikey'],
            connect = True,
        )
        my_database = client['reviews']
        for doc in my_database:
            if int(dealerId) == doc.get('id'):
                aList.append(doc)
    except CloudantException as ce:
        print("unable to connect")
        return { 'message': ce}
    except (requests.exceptions.RequestException, ConnectionResetError) as err:
        print("connection error")
        return { 'message': err}
    
    print(len(aList))
    if len(aList) < 1:
        return { 'message': 'reviews for dealerId do not exist', 'statusCode': 404 }
    
    return { 
        'statusCode': 200, 
        'body': { "reviews": aList } 
    }
