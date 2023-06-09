'use strict';

const menu = document.body.querySelector('.menu');
const menuItems = menu.querySelectorAll('.menu__item');
const menuBorder = menu.querySelector('.menu__border');
let activeItem = menu.querySelector('.active');

function clickItem(item, index) {
  menu.style.removeProperty('--timeOut');

  if (activeItem == item) return;
  if (activeItem) activeItem.classList.remove('active');

  item.classList.add('active');
  activeItem = item;
  offsetMenuBorder(activeItem, menuBorder);
}

function offsetMenuBorder(element, menuBorder) {
  const offsetActiveItem = element.getBoundingClientRect();
  const left =
    Math.floor(
      offsetActiveItem.left -
        menu.offsetLeft -
        (menuBorder.offsetWidth - offsetActiveItem.width) / 2
    ) + 'px';
  menuBorder.style.transform = `translate3d(${left}, 0 , 0)`;
}

offsetMenuBorder(activeItem, menuBorder);

menuItems.forEach((item, index) => {
  item.addEventListener('click', () => clickItem(item, index));
});

window.addEventListener('resize', () => {
  offsetMenuBorder(activeItem, menuBorder);
  menu.style.setProperty('--timeOut', 'none');
});

// animated tag cloud
function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError('attempted to get private field on non-instance');
  }
  return fn;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  let descriptor = privateMap.get(receiver);
  if (!descriptor) {
    throw new TypeError('attempted to set private field on non-instance');
  }
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError('attempted to set read only private field');
    }
    descriptor.value = value;
  }
  return value;
}
function _classPrivateFieldGet(receiver, privateMap) {
  let descriptor = privateMap.get(receiver);
  if (!descriptor) {
    throw new TypeError('attempted to get private field on non-instance');
  }
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
let _points = new WeakMap();
class FibonacciSphere {
  get points() {
    return _classPrivateFieldGet(this, _points);
  }

  constructor(N) {
    _points.set(this, { writable: true, value: void 0 });
    _classPrivateFieldSet(this, _points, []);

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y ** 2);
      const a = goldenAngle * i;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;

      _classPrivateFieldGet(this, _points).push([x, y, z]);
    }
  }
}
let _root = new WeakMap();
let _size = new WeakMap();
let _sphere = new WeakMap();
let _tags = new WeakMap();
let _rotationAxis = new WeakMap();
let _rotationAngle = new WeakMap();
let _rotationSpeed = new WeakMap();
let _frameRequestId = new WeakMap();
let _initEventListeners = new WeakSet();
let _updatePositions = new WeakSet();
let _onMouseMove = new WeakSet();
let _update = new WeakSet();

class TagsCloud {
  constructor(root) {
    _update.add(this);
    _onMouseMove.add(this);
    _updatePositions.add(this);
    _initEventListeners.add(this);
    _root.set(this, { writable: true, value: void 0 });
    _size.set(this, { writable: true, value: void 0 });
    _sphere.set(this, { writable: true, value: void 0 });
    _tags.set(this, { writable: true, value: void 0 });
    _rotationAxis.set(this, { writable: true, value: void 0 });
    _rotationAngle.set(this, { writable: true, value: void 0 });
    _rotationSpeed.set(this, { writable: true, value: void 0 });
    _frameRequestId.set(this, { writable: true, value: void 0 });
    _classPrivateFieldSet(this, _root, root);
    _classPrivateFieldSet(
      this,
      _size,
      _classPrivateFieldGet(this, _root).offsetWidth
    );
    _classPrivateFieldSet(this, _tags, root.querySelectorAll('.tag'));
    _classPrivateFieldSet(
      this,
      _sphere,
      new FibonacciSphere(_classPrivateFieldGet(this, _tags).length)
    );
    _classPrivateFieldSet(this, _rotationAxis, [1, 0, 0]);
    _classPrivateFieldSet(this, _rotationAngle, 0);
    _classPrivateFieldSet(this, _rotationSpeed, 0);

    _classPrivateMethodGet(this, _updatePositions, _updatePositions2).call(
      this
    );
    _classPrivateMethodGet(
      this,
      _initEventListeners,
      _initEventListeners2
    ).call(this);
    _classPrivateFieldGet(this, _root).classList.add('-loaded');
  }

  start() {
    _classPrivateMethodGet(this, _update, _update2).call(this);

    _classPrivateFieldSet(
      this,
      _frameRequestId,
      requestAnimationFrame(this.start.bind(this))
    );
  }

  stop() {
    cancelAnimationFrame(_classPrivateFieldGet(this, _frameRequestId));
  }
}
let _initEventListeners2 = function _initEventListeners2() {
  window.addEventListener(
    'resize',
    _classPrivateMethodGet(this, _updatePositions, _updatePositions2).bind(this)
  );
  document.addEventListener(
    'mousemove',
    _classPrivateMethodGet(this, _onMouseMove, _onMouseMove2).bind(this)
  );
};
let _updatePositions2 = function _updatePositions2() {
  const sin = Math.sin(_classPrivateFieldGet(this, _rotationAngle));
  const cos = Math.cos(_classPrivateFieldGet(this, _rotationAngle));
  const ux = _classPrivateFieldGet(this, _rotationAxis)[0];
  const uy = _classPrivateFieldGet(this, _rotationAxis)[1];
  const uz = _classPrivateFieldGet(this, _rotationAxis)[2];
  const rotationMatrix = [
    [
      cos + ux ** 2 * (1 - cos),
      ux * uy * (1 - cos) - uz * sin,
      ux * uz * (1 - cos) + uy * sin,
    ],
    [
      uy * ux * (1 - cos) + uz * sin,
      cos + uy ** 2 * (1 - cos),
      uy * uz * (1 - cos) - ux * sin,
    ],
    [
      uz * ux * (1 - cos) - uy * sin,
      uz * uy * (1 - cos) + ux * sin,
      cos + uz ** 2 * (1 - cos),
    ],
  ];
  const N = _classPrivateFieldGet(this, _tags).length;
  for (let i = 0; i < N; i++) {
    const x = _classPrivateFieldGet(this, _sphere).points[i][0];
    const y = _classPrivateFieldGet(this, _sphere).points[i][1];
    const z = _classPrivateFieldGet(this, _sphere).points[i][2];
    const transformedX =
      rotationMatrix[0][0] * x +
      rotationMatrix[0][1] * y +
      rotationMatrix[0][2] * z;
    const transformedY =
      rotationMatrix[1][0] * x +
      rotationMatrix[1][1] * y +
      rotationMatrix[1][2] * z;
    const transformedZ =
      rotationMatrix[2][0] * x +
      rotationMatrix[2][1] * y +
      rotationMatrix[2][2] * z;
    const translateX = (_classPrivateFieldGet(this, _size) * transformedX) / 2;
    const translateY = (_classPrivateFieldGet(this, _size) * transformedY) / 2;
    const scale = (transformedZ + 2) / 3;
    const transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`;
    const opacity = (transformedZ + 1.5) / 2.5;
    _classPrivateFieldGet(this, _tags)[i].style.transform = transform;
    _classPrivateFieldGet(this, _tags)[i].style.opacity = opacity;
  }
};
let _onMouseMove2 = function _onMouseMove2(e) {
  const rootRect = _classPrivateFieldGet(this, _root).getBoundingClientRect();
  const deltaX =
    e.clientX -
    (rootRect.left + _classPrivateFieldGet(this, _root).offsetWidth / 2);
  const deltaY =
    e.clientY -
    (rootRect.top + _classPrivateFieldGet(this, _root).offsetHeight / 2);
  const a = Math.atan2(deltaX, deltaY) - Math.PI / 2;
  const axis = [Math.sin(a), Math.cos(a), 0];
  const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const speed = delta / Math.max(window.innerHeight, window.innerWidth) / 10;
  _classPrivateFieldSet(this, _rotationAxis, axis);
  _classPrivateFieldSet(this, _rotationSpeed, speed);
};
let _update2 = function _update2() {
  _classPrivateFieldSet(
    this,
    _rotationAngle,
    _classPrivateFieldGet(this, _rotationAngle) +
      _classPrivateFieldGet(this, _rotationSpeed)
  );
  _classPrivateMethodGet(this, _updatePositions, _updatePositions2).call(this);
};

function main() {
  const root = document.querySelector('.tags-cloud');
  const cloud = new TagsCloud(root);

  cloud.start();
}

document.addEventListener('DOMContentLoaded', () => {
  main();
});
