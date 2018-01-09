const animatedFlower=function(){
  let animatedFlower = document.getElementById('animatedFlower');
  animatedFlower.style.visibility='hidden';
  setTimeout(function(){
    animatedFlower.style.visibility='visible';
  },1000);
};
