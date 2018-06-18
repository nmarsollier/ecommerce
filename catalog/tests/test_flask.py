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
    # print(dir(res), res.status_code)
    assert res.status_code == 200
    assert b"Hello World" in res.data


def test_some_id(app):
    res = app.get("/foo/12345")
    assert res.status_code == 200
    assert b"12345" in res.data
