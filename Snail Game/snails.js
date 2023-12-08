var canvas = {
    element: document.getElementById('canvas'),
    width: 800,
    height: 400,
    balls: [],
    initialize: function () {
      this.element.style.width = this.width + 'px';
      this.element.style.height = this.height + 'px';
      document.body.appendChild(this.element);
    }
  };
  
  var imageUrls = ['https://images.rawpixel.com/image_png_1300/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2Zyc25haWxfbW9zc19zcGlyYWxfY3Jhd2xpbmctaW1hZ2Utam9iODc1LTAxXzEucG5n.png'];
  
  var Ball = {
    create: function (dx, dy) {
      var newBall = Object.create(this);
      newBall.dx = dx;
      newBall.dy = dy;
      newBall.width = 40;
      newBall.height = 40;
      newBall.element = document.createElement('div');
      canvas.element.appendChild(newBall.element);
  
      // Set background image
      newBall.element.style.backgroundImage = 'url(' + imageUrls[0] + ')';
      newBall.element.style.backgroundSize = 'cover';
  
      newBall.element.style.width = newBall.width + 'px';
      newBall.element.style.height = newBall.height + 'px';
      newBall.element.className += ' ball';
      newBall.width = parseInt(newBall.element.style.width);
      newBall.height = parseInt(newBall.element.style.height);
  
      // Add event listeners for hover
      newBall.element.addEventListener('mouseover', function () {
        newBall.expand();
      });
  
      newBall.element.addEventListener('mouseout', function () {
        newBall.shrink();
      });
  
      return newBall;
    },
    moveTo: function (x, y) {
      this.element.style.left = x + 'px';
      this.element.style.top = y + 'px';
    },
    changeDirectionIfNecessary: function (x, y) {
      this.dx += (Math.random() - 0.5) * 0.1;
      this.dy += (Math.random() - 0.5) * 0.1;
  
      if (x < 0 || x > canvas.width - this.width) {
        this.dx = -this.dx;
      }
      if (y < 0 || y > canvas.height - this.height) {
        this.dy = -this.dy;
      }
    },
    draw: function (x, y) {
      this.moveTo(x, y);
      var ball = this;
      setTimeout(function () {
        ball.changeDirectionIfNecessary(x, y);
        ball.draw(x + ball.dx, y + ball.dy);
      }, 1000 / 20);
    },
    expand: function () {
      this.element.style.transform = 'scale(1.5)';
      this.dx = (Math.random() * 2 - 1) * 0.75;
      this.dy = (Math.random() * 2 - 1) * 0.75;
    },
    shrink: function () {
      this.element.style.transform = 'scale(1)';
    },
    createTrail: function () {
      var trail = document.createElement('div');
      trail.className = 'trail';
      canvas.element.appendChild(trail);
      return trail;
    },
    updateTrail: function (x, y) {
      this.trail.style.left = x + 'px';
      this.trail.style.top = y + 'px';
      this.trail.style.backgroundColor = this.getBackgroundColor();
    },
    removeTrail: function () {
      this.trail.remove();
    },
    drawWithTrail: function (x, y) {
      this.moveTo(x, y);
      this.trail = this.createTrail();
      this.updateTrail(x, y);
      var ball = this;
      setTimeout(function () {
        ball.changeDirectionIfNecessary(x, y);
        ball.updateTrail(x, y);
        ball.drawWithTrail(x + ball.dx, y + ball.dy);
      }, 1000 / 20);
    },
    getBackgroundColor: function () {
      var computedStyle = window.getComputedStyle(this.element);
      return computedStyle.backgroundColor;
    }
  };
  
  canvas.initialize();
  
  var initialBalls = [
    Ball.create(Math.random() * 2 - 1, Math.random() * 2 - 1),
    Ball.create(Math.random() * 2 - 1, Math.random() * 2 - 1),
    Ball.create(Math.random() * 2 - 1, Math.random() * 2 - 1)
  ];
  
  initialBalls.forEach(function (ball, index) {
    canvas.balls.push(ball);
    ball.drawWithTrail(70 + index * 50, 0);
  });
  
  canvas.element.addEventListener('click', function (e) {
    var xCoordinate = e.x - (window.innerWidth - canvas.width) / 2;
    var yCoordinate = e.y - (window.innerHeight - canvas.height) / 2;
    var randomDx = (Math.random() * 2 - 1) * 0.75;
    var randomDy = (Math.random() * 2 - 1) * 0.75;
  
    if (canvas.balls.length >= 10) {
      var removedBall = canvas.balls.shift();
      removedBall.removeTrail();
      removedBall.element.remove();
    }
  
    var newBall = Ball.create(randomDx, randomDy);
    canvas.balls.push(newBall);
    newBall.drawWithTrail(xCoordinate, yCoordinate);
  });
  