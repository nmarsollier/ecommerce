import * as error from "../../src/server/error";
import * as httpMocks from "node-mocks-http";

describe("Tests de /src/server/error", () => {
    it("newArgumentError", () => {
        const ae = error.newArgumentError("test", "Test error");
        expect(ae.code).toBeUndefined();
        expect(ae.error).toBeUndefined();
        expect(ae.messages.length).toEqual(1);
        expect(ae.messages[0].path).toEqual("test");
        expect(ae.messages[0].message).toEqual("Test error");
    });

    it("newError", () => {
        const ae = error.newError(400, "Test error");
        expect(ae.code).toEqual(400);
        expect(ae.error).toEqual("Test error");
        expect(ae.messages).toBeUndefined();
    });

    it("handleArgumentError", () => {
        const res = httpMocks.createResponse();

        const ae = error.newArgumentError("test", "Test error");
        error.handle(res, ae);

        expect(res.statusCode).toEqual(400);
        expect(res._getData()).toEqual({ "messages": [{ "message": "Test error", "path": "test" }] });
    });

    it("handleError", () => {
        const res = httpMocks.createResponse();

        const ae = error.newError(300, "Test error");
        error.handle(res, ae);

        expect(res.statusCode).toEqual(300);
        expect(res._getData()).toEqual({ "error": "Test error", "messages": undefined });
    });

    it("handle404", () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        req.originalUrl = "test.com";
        const err = Error("Testing error");

        error.handle404(req, res);

        expect(res.statusCode).toEqual(404);
        expect(res._getData()).toEqual({ "error": "Not Found", "url": "test.com" });
    });

    it("handleValidationErrorMessage", () => {
        const res = httpMocks.createResponse();

        const ae: error.ValidationErrorMessage = error.newArgumentError("test", "Test error");
        ae.messages.push({ path: "other", message: "Other Message" });
        ae.code = 300;

        error.handle(res, ae);

        expect(res.statusCode).toEqual(300);
        expect(res._getData()).toEqual({ "error": undefined, "messages": [{ "message": "Test error", "path": "test" }, { "message": "Other Message", "path": "other" }] });
    });

    it("handleMongo", () => {
        const res = httpMocks.createResponse();

        const ae: any = {};
        ae.code = 11001;
        ae.errmsg = " index: test_1";
        error.handle(res, ae);

        expect(res.statusCode).toEqual(400);
        expect(res._getData()).toEqual({ "messages": [{ "message": "Este registro ya existe.", "path": "test" }] });
    });
});