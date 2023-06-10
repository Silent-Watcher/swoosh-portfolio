'use strict';
import Typewriter from 'typewriter-effect/dist/core';
import Cursor from './cursor.js';

const scroll_to_top_btn = document.getElementById('scroll_to_top_btn');

const menu = document.body.querySelector('.menu'),
  menuItems = menu.querySelectorAll('.menu__item'),
  menuBorder = menu.querySelector('.menu__border');

let activeItem = menu.querySelector('.active');

let carousel = document.querySelector('.carousel');
let carouselPivot = carousel.querySelector('.carousel-pivot');

let carouselRadius = 200,
  carouselRotation = 0,
  carouselTilt = 0,
  carouselVelocity = 10,
  carouselIsDragging = false,
  carouselDragPosition;

let _points = new WeakMap();

let _root = new WeakMap(),
  _size = new WeakMap(),
  _sphere = new WeakMap(),
  _tags = new WeakMap(),
  _rotationAxis = new WeakMap(),
  _rotationAngle = new WeakMap(),
  _rotationSpeed = new WeakMap(),
  _frameRequestId = new WeakMap(),
  _initEventListeners = new WeakSet(),
  _updatePositions = new WeakSet(),
  _onMouseMove = new WeakSet(),
  _update = new WeakSet();

// cursor
const cursor = new Cursor({
  container: 'body',
  speed: 0.7, // animation speed
  ease: 'expo.out', // gsap easing
  visibleTimeout: 300,
});
cursor.setState('-color-blue');

// menu
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

// carousel feature

function start() {
  let items = carouselPivot.children;
  let arc = 360 / items.length;
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    item.style.transform =
      'translate3d(-50%, -50%, 0) rotateY(' +
      i * arc +
      'deg) translateZ(' +
      carouselRadius * 2 +
      'px)';
  }
}

function dragStart(position) {
  carouselIsDragging = true;
  carouselVelocity = 0;
  carouselDragPosition = position.x;
}

function dragMove(position) {
  carouselVelocity =
    (Math.atan2(position.x - carouselDragPosition, carouselRadius * 2) * 180) /
    Math.PI;
  carouselDragPosition = position.x;
}

function dragEnd(position) {
  carouselIsDragging = false;
}

function update() {
  carouselRotation += carouselVelocity;

  if (!carouselIsDragging) {
    carouselVelocity *= 0.95;
  }

  carouselTilt += (carouselVelocity * 0.1 - carouselTilt) / 10;

  carouselPivot.style.transform =
    'translateZ(-' +
    carouselRadius * 2 +
    'px) rotateX(' +
    -carouselTilt +
    'deg) rotateY(' +
    carouselRotation +
    'deg) ';
}

(function () {
  let location = function (evt) {
    let t1 = evt.touches,
      t2 = evt.changedTouches;
    let s = (t1 && t1[0]) || (t2 && t2[0]) || evt;
    return { x: s.pageX, y: s.pageY };
  };
  let prevent = function (evt) {
    evt.preventDefault();
  };
  let handler = function (evt) {
    switch (evt.type) {
      case 'mousedown':
        add(document, ['mousemove', 'mouseup']);
      case 'mousedown':
      case 'touchstart':
        prevent(evt);
        dragStart(location(evt));
        break;
      case 'mousemove':
      case 'touchmove':
        dragMove(location(evt));
        break;
      case 'mouseup':
        remove(document, ['mousemove', 'mouseup']);
      case 'mouseup':
      case 'touchend':
      case 'touchcancel':
        dragEnd(location(evt));
        break;
    }
  };
  let add = function (target, events) {
    for (let i = 0; i < events.length; i++) {
      target.addEventListener(events[i], handler);
    }
  };
  let remove = function (target, events) {
    for (let i = 0; i < events.length; i++) {
      target.removeEventListener(events[i], handler);
    }
  };

  add(carousel, [
    'mousedown',
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
  ]);
  carousel.ondragstart = function () {
    return false;
  };
})();

(function () {
  let timestamp = window.performance
    ? function () {
        return window.performance.now() / 1000;
      }
    : function () {
        return new Date().getTime() / 1000;
      };
  let requestFrame =
    window.requestAnimationFrame ||
    function (callback) {
      setTimeout(callback, 16);
    };
  start();
  let time = timestamp();
  let enterFrame = function () {
    let now = timestamp();
    let delta = now - time;
    time = now;
    update(delta);
    requestFrame(enterFrame);
  };
  requestFrame(enterFrame);
})();
// qualification section
// qualification
const tabs = document.querySelectorAll('[data-target]'),
  tabContents = document.querySelectorAll('[data-content]');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.target);
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove('qualification__active');
    });
    target.classList.add('qualification__active');
    tabs.forEach((tab) => {
      tab.classList.remove('qualification__active');
    });
    tab.classList.add('qualification__active');
  });
});

function changeMenuStyleOnScroll() {
  let scrollFromTop = document.documentElement.scrollTop,
    nav = document.querySelector('nav');
  if (scrollFromTop > 0) nav.classList.add('active-nav');
  else nav.classList.remove('active-nav');
}

function changeTheme() {
  const theme_btn = document.querySelector('#theme-btn');
  theme_btn.addEventListener('click', function () {
    const icon = this.firstElementChild;
    if (icon.classList.contains('bx-sun')) {
      icon.classList.replace('bx-sun', 'bx-moon');
      document.body.classList.add('light');
    } else {
      icon.classList.replace('bx-moon', 'bx-sun');
      document.body.classList.remove('light');
    }
  });
}

window.addEventListener('scroll', (event) => {
  let scrollFromTop = document.documentElement.scrollTop;
  changeMenuStyleOnScroll();
  scroll_to_top_btn.classList[scrollFromTop > 200 ? 'add' : 'remove']('appearButton');
});

window.addEventListener('load', (event) => {
  // scroll to top button
  scroll_to_top_btn.addEventListener('click', () => {
    document.documentElement.scrollTop = 0;
  });
  //
  //
  changeCopyrightDate();
  // changing theme feature
  changeTheme();
  // typing effect
  new Typewriter('#typewriter', {
    strings: [
      'Data Specialist',
      'ML Enthusiastic',
      'Robots Lover',
      'A Normal Human Being',
    ],
    autoStart: true,
    loop: true,
  });
});

// dynamic tab change
window.addEventListener('blur', function () {
  this.document.title = '😣 ?!!';
});
window.addEventListener('focus', function () {
  this.document.title = 'swoosh';
});

// menu bar animation
offsetMenuBorder(activeItem, menuBorder);

menuItems.forEach((item, index) => {
  item.addEventListener('click', () => clickItem(item, index));
});

window.addEventListener('resize', () => {
  offsetMenuBorder(activeItem, menuBorder);
  menu.style.setProperty('--timeOut', 'none');
});

document.addEventListener('DOMContentLoaded', () => {
  main();
});

let sections = document.querySelectorAll('[data-section]');

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      let nav_link = document.querySelector(
        `[section-link=${entry.target.dataset.section}]`
      );
      if (!entry.isIntersecting) {
        nav_link.classList.remove('active');
      } else {
        nav_link.classList.add('active');
        clickItem(nav_link);
      }
    });
  },
  { threshold: 0 }
);

sections.forEach((section) => {
  observer.observe(section);
});

function changeCopyrightDate() {
  document.querySelector('date').innerHTML = new Date().getFullYear();
}
