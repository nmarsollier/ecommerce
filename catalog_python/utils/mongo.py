import pymongo

client = pymongo.MongoClient('localhost', 27017)

db = client['catalog']

articles = db.articles
