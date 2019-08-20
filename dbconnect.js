const mariadb = require("mariadb");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());

app.get('/', (req, res, next) => {
    if (req.cookies['user-session']){
        res.sendFile(path.join(__dirname + '/loginSuccess.html'));
        return;
    }
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/logout' , (req, res, next) => {
    res.cookie('user-session' , '');
    res.redirect('/');
})

app.post('/login', async(req, res, next)=> {
    var identity = req.body.identity;
    var password = req.body.password;
    console.log(identity, password);
    const db = await dbConnect();
    if (db) {
        let result;
        try{
            result = await db.query("SELECT * FROM users1s WHERE identity = '" + identity +"' AND password = '" + password +"'");
        }catch(err){
            return res.send(err);
            db.destroy(); //서버에 쌓이는걸 방지
        }
        db.destroy(); // 서버에 쌓이는걸 방지
        
        if (result.length === 1) {
            res.cookie('user-session' , result[0].identity);
            res.redirect('/');
            return;
        }
        res.send('LOGIN FAILED.');
        return;
    } 
    res.send("DB ERROR");
});

app.listen(5555);

async function dbConnect (){
    let connection;
    try{
    connection = await mariadb.createConnection({
        host: '52.79.46.222',
        port: 3306,
        user: 'root',
        password: "admin_123!",
        database: "Education",
    });
 } catch(err) {
     console.log(err);
     connection = null;
 }
    return connection;
    
}
dbConnect();
