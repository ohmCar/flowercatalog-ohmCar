const http=require('http');
const fs=require('fs');

const defaultDirectory='./public';
const pathOfCommentsFile='./data/comments.json';

const WebApp = require('./webapp.js');
const commentsFile=require(pathOfCommentsFile);

let app = WebApp.create();


//
// const requestHandler=function(req,res){

//   setHeader(req,extensionOfFile,res,file);
//   // console.log(`${req.method} ${req.url}`);
//   if(req.url=='/comment')
//     return getComments(res,req);
//     res.end();
//   }else if(req.url=='/guestBook.html'){
//     return readingGuestBook(res);
//     res.end();
//   } else if(req.url=='/'){
//     res.writeHead(302,{
//       'location':'/index.html'
//     });
//   }else{
//     return pageFound(res,req);
//     res.end();
//   }
//   res.end();
// };
//

//
// const pageFound=function(res,req){
//   if(fs.existsSync(defaultDirectory+req.url)){
//     fs.readFile((defaultDirectory+req.url),(err,data)=>{
//       if(err) return;
//       res.write(data);
//       res.end();
//     });
//   } else{
//     return pageNotFound(res);
//   };
// };
//
// const pageNotFound=function(res){
//   res.statusCode=404;
//   res.write('Page not found');
//   res.end();
// };
//
// const getComments=function(res,req){
//   req.on('data',data=>{
//     let query={};
//     let arrayOfComments=data.toString().split('&');
//     query['fname']=arrayOfComments[0].split('=')[1].replace(/\+/g,' ');
//     query['comment']=arrayOfComments[1].split('=')[1].replace(/\+/g,' ');
//     storingComments(query,commentsFile);
//   });
//   res.writeHead(302,{
//     'location':'/guestBook.html'
//   });
//   res.end();
// };
//
// const readingGuestBook=function(res){
//   fs.readFile((defaultDirectory+'/guestBook.html'),(err,data)=>{
//     if(err) return;
//     res.write(data+displayComments());
//     res.end();
//   });
// };
//
// const storingComments=function(query){
//   let dateOfComment=new Date();
//   let date=dateOfComment.toLocaleDateString();
//   let time=dateOfComment.toLocaleTimeString();
//   let name=query.fname;
//   let comment=query.comment;
//   commentsFile.unshift(`<p style="font-size:20px";> ${date}, ${time},
//   Name: ${name}, Comment: ${comment}</p>`);
//   fs.writeFile(pathOfCommentsFile,JSON.stringify(commentsFile),err=>{
//     if(err) return;
//   });
// };
//
// const displayComments=function(){
//   let readComments=commentsFile.join('\n');
//   return readComments;
// };

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
  if(doesExist(req)){
    setHeader(req,res);
    res.write(fs.readFileSync(defaultDirectory+req.url));
    res.end();
  }
}

app.use(serveFile);

const PORT=8001;
const server=http.createServer(app);
server.listen(PORT);
console.log(`listening to the port ${PORT}`);
