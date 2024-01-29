from pymongo import MongoClient


def db_connection(url: str, db_name: str, collection_name: str):
    client = MongoClient(url)
    db_handle = client[f"{db_name}"]
    collection = db_handle[f"{collection_name}"]
    return db_handle, client, collection
