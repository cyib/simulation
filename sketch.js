const TOTAL_ATOMS = 12;
const WIDTH = getWidth();
const HEIGHT = getHeight();
const MAX_STARTING_VEL = 5;
const atoms = [];

function setup() {
  createCanvas(WIDTH, HEIGHT);
  for (var i = 0; i < TOTAL_ATOMS; i++) {
    atoms.push(newAtom());
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomForce() {
  return createVector(Math.random() * MAX_STARTING_VEL - MAX_STARTING_VEL / 2,
    Math.random() * MAX_STARTING_VEL - MAX_STARTING_VEL / 2);
}

function newAtom(unic = false) {
  var x, y, type, atom;
  if (unic) {
    type = 1;
    x = WIDTH / 2;
    y = HEIGHT / 2;
    atom = new Atom(x, y, type, randomForce(), 10, 4);
    return atom;
  }

  type = getRandomInt(0, 2);
  x = getRandomInt(0, WIDTH / 4);
  if (type == 1) x += 3 * WIDTH / 4;
  y = getRandomInt(0, WIDTH);
  x = WIDTH / 2;
  y = HEIGHT / 2;

  atom = new Atom(x, y, type, randomForce(), getRandomInt(1, 118), getRandomInt(1, 118));
  return atom;
}

function moveAtom(atom) {
  atom.update();
  for (var other of atoms) {
    if (other != atom) {
      atom.collideCircle(other);
    }
  }
}

function drawAtom(atom) {
  atom.show();
}

function draw() {
  atoms.forEach(moveAtom);

  background(color(255, 255, 255));
  atoms.forEach(drawAtom);
}

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}