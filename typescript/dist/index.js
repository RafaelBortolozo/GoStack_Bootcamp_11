"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express")); //import gracas ao typescript
var app = express_1.default();
app.get('/', function (request, response) {
    return response.json({ message: 'Hello world' });
});
app.listen(3333);
