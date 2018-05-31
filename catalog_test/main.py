import flask
import articles.route as articlesRoutes

app = flask.Flask(__name__)

articlesRoutes.init(app)

if __name__ == "__main__":
    app.run()
