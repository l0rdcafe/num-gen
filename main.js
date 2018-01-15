const model = {
  state: {
    numVal: 0
  }
};
const doubledNumGen = function*() {
  let n = 0;
  while (true) {
    if (n >= 1) {
      yield n;
      n *= 2;
    } else {
      yield n;
      n += 1;
    }
  }
};
const view = {
  render(val) {
    document.getElementById("num").innerHTML = val;
  }
};

const genObj = doubledNumGen();
genObj.next();

const handlers = {
  btnListener() {
    function doubleNum() {
      const { value } = genObj.next();
      model.state.numVal = value;
      view.render(model.state.numVal);
    }
    document.querySelector(".button").addEventListener("click", doubleNum);
  }
};

handlers.btnListener();
