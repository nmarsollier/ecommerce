import flask
import articles.route as articlesRoutes
import rabbit.rabbit_service as rabbitService
import utils.config as config

app = flask.Flask(__name__)

rabbitService.init()

articlesRoutes.init(app)


# Servidor de archivos estaticos de apidoc
# Por el momento se genera con ../auth/node_modules/.bin/apidoc -i ./ -o public
@app.route('/<path:path>')
def sendPublic(path):
    return flask.send_from_directory('public', path)


@app.route('/')
def sendHome():
    return flask.send_from_directory('public', "index.html")


if __name__ == "__main__":
    app.run(port=config.getServerPort())
