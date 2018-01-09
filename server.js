const http=require('http');
const fs=require('fs');

const defaultDirectory='./public';
const pathOfCommentsFile='./data/comments.json';

const WebApp = require('./webapp.js');
const commentsFile=require(pathOfCommentsFile);

let app = WebApp.create();
let registeredUsers=['omkar'];

const setHeader=function(req,res){
  let file=".."+req.url;
  let extensionOfFile=file.slice(file.lastIndexOf("."));
  res.setHeader("Content-type",header[extensionOfFile]);
};

const header={
  ".jpg":"img/jpg",
  ".html":"text/html",
  ".css":"text/css",
  ".js":"text/javascript",
  ".gif":"img/gif",
  ".pdf":"text/pdf"
};

const doesExist=req=>{
  return fs.existsSync(defaultDirectory+req.url);
}

const serveFile=function(req,res){
  if(req.url=='/') req.url='/index.html';
  if(doesExist(req)){
    setHeader(req,res);
    res.write(fs.readFileSync(defaultDirectory+req.url));
    res.end();
  }
}

app.use(serveFile);

app.get('/login',(req,res)=>{
  res.setHeader('Content-type','text/html');
  if(req.cookies.logInFailed) res.write('<p>logIn Failed</p>');
  res.write(
    `<form method="post">
    Username: <input type="text" name="userName">
    <input type="submit">
    </form>`
  );
  res.end();
});

app.post('/login',(req,res)=>{
  let user = registeredUsers.includes(req.body.userName);
  if(!user){
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login');
    return;
  }
  res.setHeader('Set-Cookie',`logInFailed=false`);
  res.redirect('/guestBook.html');
});

const PORT=8001;
const server=http.createServer(app);
server.listen(PORT);
console.log(`listening to the port ${PORT}`);
