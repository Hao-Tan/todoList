const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// 连接至数据库
mongoose.connect('mongodb+srv://frank:frank@cluster0-0txdp.mongodb.net/Todo?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
// 连接失败时
mongoose.connection.on("error", err => {
    console.error(err);
    
})
// 连接成功时
mongoose.connection.on("open", () => {
    console.log("connected!");
    
});

const todoSchema = new mongoose.Schema({
    item: String
});
const item = mongoose.model("item", todoSchema);

const urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = app => {
    // 访问/todo时调用
    app.get("/todo", (req, res) => {
        item.find({}, (err, data) => {
            res.render("todo", {
                listData: data
            });
        })
    });

    // /todo请求增加内容时调用
    app.post("/todo", urlencodedParser, (req, res) => {
        let newItem = new item(req.body);
        newItem.save(err => {
            if (err) {
                return console.error(err);

            };
            res.send();

        })
    });

    // 删除时调用的控制器
    app.delete("/todo/:item", (req, res) => {
        item.find({item: req.params.item.replace(/-/g," ")}).remove((err, data) => {
            console.log(data);
            res.send();
        })
    });
}