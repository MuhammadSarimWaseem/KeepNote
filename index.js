const express = require("express");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/home', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            console.error("Error reading files:", err);
            return res.status(500).send("Internal Server Error");
        }
        return res.render('home', { files });
    });
});

app.get('/files/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }
        console.log(filedata);
        return res.render('detail', { filename: req.params.filename, filedetail: filedata });
    });
});

app.post('/create', (req, res) => {
    const title = req.body.title.split(' ').join('');
    fs.writeFile(`./files/${title}.txt`, req.body.detail, (err) => {
        if (err) {
            console.error("Error creating file:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/');
    });
});

app.get('/', (req, res) => {
    res.render('test');
});

app.listen(process.env.PORT, () => { console.log("Server connected on port", process.env.PORT); });

module.exports = app;
