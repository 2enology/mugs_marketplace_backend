"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const listednfts_routes_1 = __importDefault(require("./routes/listednfts.routes"));
const collection_routes_1 = __importDefault(require("./routes/collection.routes"));
// import uploadMusicRoute from "./routes/nfts.routes";
const app = (0, express_1.default)();
const port = config_1.PORT;
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/nft", listednfts_routes_1.default);
app.use("/collection", collection_routes_1.default);
// MongoDB Connection
mongoose_1.default.set("strictQuery", true);
mongoose_1.default
    .connect(process.env.NODE_ENV_MONGO_URL)
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("==========> Server is running! ⏲  <==========");
    app.listen(port, () => {
        console.log(`==========> Connected MongoDB 👌  <==========`);
    });
}))
    .catch((err) => {
    console.log("Cannot connect to the bot! 😩", err);
    process.exit();
});
// Routes
app.get("/", (req, res) => {
    res.send("Server is running.👌");
});
