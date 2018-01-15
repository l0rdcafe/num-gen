const model = {
  state: {
    numVal: 0
  }
};

const doubledNumGen = function*(n = 0) {
  for (n; ; n += 1) {
    yield n * 2;
  }
};

const view = {
  render(val) {
    document.getElementById("num").innerHTML = val;
  }
};

const handlers = {
  btnListener() {
    function doubleNum() {
      const genObj = doubledNumGen();
      genObj.next();
      const { value } = genObj.next();
      genObj.next(value);
      model.state.numVal = value;
      view.render(model.state.numVal);
    }
    document.querySelector(".button").addEventListener("click", doubleNum);
  }
};

handlers.btnListener();
