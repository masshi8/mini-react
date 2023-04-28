let nextUnitOfwork = null;
let wipRoot = null;
function perforUnitOfWork(fiber) {
  // 执行任务单元、得到下一个任务单元
  // reactElement 转换成一个真实dom
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }
  // 为当前的fiber创造他子节点的fiber
  // parent child sibling
  // return出下一个任务单元
  const elements = fiber?.props?.children;
  let prevsibling = null;
  console.log(wipRoot, "----perforUnitOfWork", elements);

  elements.forEach((childrenElement, index) => {
    const newFiber = {
      parent: fiber,
      props: childrenElement.props,
      type: childrenElement.type,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevsibling.sibling = newFiber;
    }
    prevsibling = newFiber;
  });
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    console.log("nextFiber-->", nextFiber);
    nextFiber = nextFiber.parent;
  }
}

function commitWork(fiber) {
  if (!fiber) return;
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitRoot() {
  // 渲染真实dom
  console.log(wipRoot, "----commitRoot");

  commitWork(wipRoot.child);
  wipRoot = null;
}

// 控制执行时机
function workLoop(deadline) {
  let shouldYield = true;

  while (nextUnitOfwork && shouldYield) {
    nextUnitOfwork = perforUnitOfWork(nextUnitOfwork);
    console.log("workLoop", nextUnitOfwork);
    shouldYield = deadline.timeRemaining() > 1; // 得到浏览器当前帧剩余的时间。 react用的是scheduler
  }

  if (!nextUnitOfwork && wipRoot) {
    console.log(nextUnitOfwork, "----", wipRoot);
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);
function createDom(element) {
  // 创建节点
  let dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  // 赋属性
  const isProperty = (key) => key !== "children";
  Object.keys(element?.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = element.props[name]));
  // 处理子节点
  element?.props?.children?.forEach((child) => render(child, dom));
  // container.appendChild(dom);
  return dom;
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  nextUnitOfwork = wipRoot;
}

export default render;
