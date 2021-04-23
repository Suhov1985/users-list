// var big = document.getElementById('big');
// var small = document.getElementById('small');
// var points = [
//     [100,10],
//     [40,198],
//     [190,78],
//     [10,78],
//     [160,198],
// ]
// function drawStar(x, y, pol) {
//   points.forEach(function(item, i, arr) {
//     var point = big.createSVGPoint();
//     point.x = item[0] + x;
//     point.y = item[1] + y;
//     pol.points.appendItem(point);
//   });
// }
// var star = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
// var star2 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
// var star3 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
// var star4 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
// var star5 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
// big.appendChild(star);
// big.appendChild(star2);
// big.appendChild(star3);
// big.appendChild(star4);
// big.appendChild(star5);
// drawStar(0,0, star);
// drawStar(200,0, star2);
// drawStar(400,0, star3);
// drawStar(100,200, star4);
// drawStar(300,200, star5);
// star.classList.add('star','red');
// star2.classList.add('star','blue');
// star3.classList.add('star','green');
// star4.classList.add('star','yellow');
// star5.classList.add('star','black');
// var stars = document.getElementsByClassName('star');
// function clickStar (evt) {
//   evt.stopPropagation();
//   small.style.background = this.classList[1];
// }
// function clickBig () {
//   small.style.background = '#fff';
// }
// for (var i = 0; i < stars.length; i++) {
//   stars[i].addEventListener('click', clickStar, false);
// }
// big.addEventListener('mousedown', clickBig, false);
const colors = ['red', 'blue', 'green', 'yellow', 'black']
const canvas = document.getElementById("bigCanvas")
const ctx = canvas.getContext("2d")
ctx.fillStyle = "#fff"
ctx.fillRect(0,0,600,600)

const canvasSmall = document.getElementById("smallCanvas")
const ctxSmall = canvasSmall.getContext("2d")
ctxSmall.fillStyle = "#fff"
ctxSmall.fillRect(0,0,600,50)

let starsPoints = []
function drawStar2(cx,cy,spikes,outerRadius,innerRadius, color){
  let rot = Math.PI/2*3
  let x = cx
  let y = cy
  let step = Math.PI/spikes
  let star = []
  let starX = []
  let starY = []

  ctx.beginPath();
  ctx.moveTo(cx,cy-outerRadius)

  for(i = 0; i < spikes; i++){
    x = cx + Math.cos (rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    starX.push(x)
    starY.push(y)
    ctx.lineTo(x,y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x,y)
    starX.push(x)
    starY.push(y)
    rot += step
  }
  ctx.lineTo(cx,cy-outerRadius)
  ctx.closePath()
  ctx.fillStyle=color
  ctx.fill()
  star.push(starX, starY)
  starsPoints.push(star)
}

drawStar2(100,150,5,85,35, colors[0]);
drawStar2(300,150,5,85,35, colors[1]);
drawStar2(500,150,5,85,35, colors[2]);
drawStar2(200,400,5,85,35, colors[3]);
drawStar2(400,400,5,85,35, colors[4]);

canvas.addEventListener('click', function(event) {
  function inPoly(x,y,arr) {
    let c = 0;
    let xp = arr[0]
    let yp = arr[1]
    let npol = xp.length;
    let j = npol - 1;

    for (let i = 0; i < npol; i++) {
      if ((((yp[i] <= y) && (y < yp[j])) || ((yp[j] <= y) && (y < yp[i]))) &&
          (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
        c = !c
      }
      j = i;
    }
    return c;
  }

  let clickedStar = []
  starsPoints.forEach(function(item, i) {
    clickedStar.push(inPoly(event.layerX, event.layerY, starsPoints[i]))
  });

  for (let i = 0; i < clickedStar.length; i++) {
    if(clickedStar[i]) {
      let color = ''
      let num = +i + 1
      switch (num) {
        case 1:
          color = colors[0]
          break
        case 2:
          color = colors[1]
          break
        case 3:
          color = colors[2]
          break
        case 4:
          color = colors[3]
          break
        case 5:
          color = colors[4]
          break
        default:
          color = '#fff'
      }
      ctxSmall.fillStyle = color
      ctxSmall.fillRect(0,0,600,50)
      break
    }
    if(!clickedStar[i]) {
      ctxSmall.fillStyle = '#fff'
      ctxSmall.fillRect(0,0,600,50)
    }
  }
}, false);



