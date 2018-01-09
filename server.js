const http=require('http');
const fs=require('fs');
const url=require('url');

const PORT=8001;
const defaultDirectory='./public';
const pathOfCommentsFile='./data/comments.json';

const commentsFile=require('./data/comments.json');

const header={
  ".jpg":"img/jpg",
  ".html":"text/html",
  ".css":"text/css",
  ".js":"text/javascript",
  ".gif":"img/gif",
  ".pdf":"text/pdf"
};

const requestHandler=function(req,res){
  let file=".."+req.url;
  let extensionOfFile=file.slice(file.lastIndexOf("."));
  setHeader(req,extensionOfFile,res,file);
  console.log(`${req.method} ${req.url}`);
  if(req.url=='/comment'){
    return getComments(res,req);
    res.end();
  }else if(req.url=='/guestBook.html'){
    return readingGuestBook(res);
    res.end();
  } else if(req.url=='/'){
    res.writeHead(302,{
      'location':'/index.html'
    });
  }else{
    return pageFound(res,req);
    res.end();
  }
  res.end();
};

const setHeader=function(req,extensionOfFile,res,file){
  if(req.url=='/'){
    extensionOfFile=".html";
  };
  if(fs.existsSync(file)){
    res.setHeader("Content-type",header[extensionOfFile]);
  };
};

const pageFound=function(res,req){
  if(fs.existsSync(defaultDirectory+req.url)){
    fs.readFile((defaultDirectory+req.url),(err,data)=>{
      if(err) return;
      res.write(data);
      res.end();
    });
  } else{
    return pageNotFound(res);
  };
};

const pageNotFound=function(res){
  res.statusCode=404;
  res.write('Page not found');
  res.end();
};

const getComments=function(res,req){
  req.on('data',data=>{
    let query={};
    let arrayOfComments=data.toString().split('&');
    query['fname']=arrayOfComments[0].split('=')[1].replace(/\+/g,' ');
    query['comment']=arrayOfComments[1].split('=')[1].replace(/\+/g,' ');
    storingComments(query,commentsFile);
  });
  res.writeHead(302,{
    'location':'/guestBook.html'
  });
  res.end();
};

const readingGuestBook=function(res){
  fs.readFile((defaultDirectory+'/guestBook.html'),(err,data)=>{
    if(err) return;
    res.write(data+displayComments());
    res.end();
  });
};

const storingComments=function(query){
  let dateOfComment=new Date();
  let date=dateOfComment.toLocaleDateString();
  let time=dateOfComment.toLocaleTimeString();
  let name=query.fname;
  let comment=query.comment;
  commentsFile.unshift(`<p style="font-size:20px";> ${date}, ${time},
  Name: ${name}, Comment: ${comment}</p>`);
  fs.writeFile(pathOfCommentsFile,JSON.stringify(commentsFile),err=>{
    if(err) return;
  });
};

const displayComments=function(){
  let readComments=commentsFile.join('\n');
  return readComments;
};

const server=http.createServer(requestHandler);
server.listen(PORT);
console.log(`listening to the port ${PORT}`);
