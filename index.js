const express = require("express")
const path = require("path")
const fs = require("fs")

const app = express()
const PORT = 3000

app.set('view engine', 'ejs')
app.set("views", path.resolve('./views'))

//Middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: 'false' }))
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.get('/', (req, res) => {
    res.send("index")
})

app.get('/home', (req, res) => {
    fs.readdir('./files', (err, files) => {
        return res.render('home', { files })
    })
})

app.get('/files/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        console.log(filedata)
        return res.render('detail', { filename: req.params.filename, filedetail: filedata })
    })
})

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.detail, (err) => {
        res.redirect('/home')
    })
})

app.listen(PORT, () => { console.log("server connected", PORT) })