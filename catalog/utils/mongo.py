# coding=utf_8

import pymongo
import utils.config as config

client = pymongo.MongoClient(config.getDatabaseServerUrl(), config.getDatabaseServerPort())

db = client['catalog']

articles = db.articles
