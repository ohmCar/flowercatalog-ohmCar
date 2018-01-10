const http=require('http');
const fs=require('fs');

const defaultDirectory='./public';
const pathOfCommentsFile='./data/comments.json';

const WebApp = require('./webapp.js');
const commentsFile=require(pathOfCommentsFile);

let app = WebApp.create();
let registeredUsers=[{userName:'omkar'}];

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

const getComments=(req,res)=>{
  if(req.body.fname){
    req.body.fname=req.body.fname.replace(/\+/g,' ');
    req.body.comment=req.body.comment.replace(/\+/g,' ');
    req.body.dateTime=new Date().toLocaleString();
    commentsFile.unshift(req.body);
    fs.writeFileSync(pathOfCommentsFile,JSON.stringify(commentsFile,null,2));
  }
};

const doesExist=req=>{
  return fs.existsSync(defaultDirectory+req.url);
}

const serveFile=function(req,res){
  if(req.url=='/') req.url='/index.html';

  if(req.url=='/guestBook.html'){
    setHeader(req,res);
    if(req.user){
      res.write(`loggedin as ${req.user.userName}`);
      res.write(fs.readFileSync(defaultDirectory+req.url));
    } else {
      res.write(fs.readFileSync(defaultDirectory+'/guestbookWithoutLoggedin.html'));
    }
    commentsFile.forEach(comment=>{
      res.write(
        `<p style="font-size:20px;">${comment.dateTime},
        Name: ${comment.fname},
        comment: ${comment.comment}</p>`
      );
    });
    res.end();
    return;
  }

  if(doesExist(req)){
    setHeader(req,res);
    res.write(fs.readFileSync(defaultDirectory+req.url));
    res.end();
  }
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registeredUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

app.use(loadUser);
app.use(serveFile);

app.get('/login',(req,res)=>{
  if(req.user){
    res.redirect("/guestBook.html");
    return;
  }
  res.setHeader('Content-type','text/html');
  res.write(
    `<form method="post">
    Username: <input type="text" name="userName">
    <input type="submit">
    </form>`
  );
  res.end();
});

app.post('/login',(req,res)=>{
  if(req.user){
    getComments(req,res);
    res.redirect("/guestBook.html");
    return;
  }
  console.log(registeredUsers);
  let user = registeredUsers.find(u=>u.userName==req.body.userName);
  if(!user){
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestBook.html');
});

app.get('/logout',(req,res)=>{
  if(req.user){
    res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
    delete req.user.sessionid;
  }
  res.redirect('/login');
});

const PORT=8001;
const server=http.createServer(app);
server.listen(PORT);
console.log(`listening to the port ${PORT}`);
