"use strict";

import { Express } from "express";

export function init(app: Express) {
  app.get("/", (req, res, next) => {
    res.redirect("index.html");
  });
}
