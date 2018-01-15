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
