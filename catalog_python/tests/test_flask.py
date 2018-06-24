import pytest

from application.app import MainApp


@pytest.fixture
def app(mocker):
    with mocker.patch('application.app.MainApp._init_rabbit') as patched:
        app = MainApp()

    flask_app = app.get_flask_app()
    flask_app.debug = True
    return flask_app.test_client()


def test_hello_world(app):
    res = app.get("/")
    assert res.status_code == 200


def test_some_id(app):
    res = app.get("/#api-Articulos")
    assert res.status_code == 200
