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
    
    review = dict.get('review')
    if (review is None):
        return { 'message': 'review is required', 'statusCode': 404 }
    
    try:
        client = Cloudant.iam(
            account_name = dict['cloudant_username'],
            api_key = dict['cloudant_apikey'],
            connect = True,
        )
        my_database = client['reviews']

        my_document = my_database.create_document(review)
        
        if my_document.exists():
            return { 'message': 'successfully inserted review', 'statusCode': 200 }
        return { 'message': 'Something went wrong on the server', 'statusCode': 500 }

    except CloudantException as ce:
        print("unable to connect")
        return { 'message': ce}
    except (requests.exceptions.RequestException, ConnectionResetError) as err:
        print("connection error")
        return { 'message': err}

