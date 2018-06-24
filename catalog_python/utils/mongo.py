# coding=utf_8

import pymongo
import utils.config as config

client = pymongo.MongoClient(config.get_database_server_url(), config.get_database_server_port())

db = client['catalog']

articles = db.articles
