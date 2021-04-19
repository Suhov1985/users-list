var big = document.getElementById('big');
var small = document.getElementById('small');
var points = [
    [100,10],
    [40,198],
    [190,78],
    [10,78],
    [160,198],
]
function drawStar(x, y, pol) {
  points.forEach(function(item, i, arr) {
    var point = big.createSVGPoint();
    point.x = item[0] + x;
    point.y = item[1] + y;
    pol.points.appendItem(point);
  });
}
var star = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
var star2 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
var star3 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
var star4 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
var star5 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
big.appendChild(star);
big.appendChild(star2);
big.appendChild(star3);
big.appendChild(star4);
big.appendChild(star5);
drawStar(0,0, star);
drawStar(200,0, star2);
drawStar(400,0, star3);
drawStar(100,200, star4);
drawStar(300,200, star5);
star.classList.add('star','red');
star2.classList.add('star','blue');
star3.classList.add('star','green');
star4.classList.add('star','yellow');
star5.classList.add('star','black');
var stars = document.getElementsByClassName('star');
function clickStar (evt) {
  evt.stopPropagation();
  small.style.background = this.classList[1];
}
function clickBig () {
  small.style.background = '#fff';
}
for (var i = 0; i < stars.length; i++) {
  stars[i].addEventListener('click', clickStar, false);
}
big.addEventListener('mousedown', clickBig, false);



