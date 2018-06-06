# coding=utf_8

import flask
import articles.route as articlesRoutes
import rabbit.rabbit_service as rabbitService
import utils.config as config
import os.path

app = flask.Flask(__name__)

rabbitService.init()

articlesRoutes.init(app)

if(os.path.isfile('../auth/node_modules/apidoc/bin/apidoc')):
    os.system("../auth/node_modules/apidoc/bin/apidoc -i ./ -o ./public")

# Servidor de archivos estaticos de apidoc
# Por el momento se genera con ../auth/node_modules/.bin/apidoc -i ./ -o public
@app.route('/<path:path>')
def sendPublic(path):
    return flask.send_from_directory('public', path)


@app.route('/')
def sendHome():
    return flask.send_from_directory('public', "index.html")


if __name__ == "__main__":
    app.run(port=config.getServerPort())
