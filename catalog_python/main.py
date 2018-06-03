import flask
import articles.route as articlesRoutes
import rabbit.rabbit_service as rabbitService

app = flask.Flask(__name__)

rabbitService.init()

articlesRoutes.init(app)

if __name__ == "__main__":
    app.run(port=3002)
