const genFuncs = (function() {
  class Iterator {
    constructor(items) {
      this.index = 0;
      this.items = items;
    }

    first() {
      this.reset();
      return this.next();
    }
    next() {
      return this.index[(this.index += 1)];
    }
    hasNext() {
      return this.index <= this.items.length;
    }
    reset() {
      this.index = 0;
    }
    each(callback) {
      for (let item = this.first(); this.hasNext(); item = this.next()) {
        callback(item);
      }
    }
  }

  const take = function*(n, iterable) {
    for (const x of iterable) {
      if (n <= 0) {
        return;
      }
      n -= 1;
      yield x;
    }
  };

  const cycle = function*(array) {
    for (let i = 0; ; i += 1) {
      if (i === array.length) {
        i = 0;
      }
      yield array[i];
    }
  };

  const count = function*(n) {
    while (true) {
      yield n;
      n += 1;
    }
  };

  const repeat = function*(elem, n) {
    let result = "";
    for (let i = 0; i < n; i += 1) {
      result += elem;
    }
    yield result;
  };

  return {
    count,
    take,
    repeat,
    Iterator,
    cycle
  };
})();

const model = (function() {
  const initGen = function(gen) {
    const genObj = gen();
    genObj.next();
    return genObj;
  };

  const doubledNumGen = function*() {
    let n = 1;
    while (true) {
      yield n;
      n *= 2;
    }
  };
  const numGenObj = initGen(doubledNumGen);

  const bdayGen = function*(day, month) {
    while (true) {
      const bday = moment()
        .date(day)
        .month(month);
      yield bday;
      while (true) {
        bday.add(1, "years");
        yield bday;
      }
    }
  };

  return {
    numGenObj,
    bdayGen
  };
})();

const view = {
  renderNum(val) {
    document.getElementById("numText").innerHTML = val;
  },
  renderNextBday(val) {
    document.getElementById("bdayText").innerHTML = val;
  },
  removeFieldsAndBtn() {
    const fields = document.querySelectorAll(".input");
    const enterBtn = document.getElementById("enterBday");
    for (let i = 0; i < fields.length; i += 1) {
      fields[i].parentNode.removeChild(fields[i]);
    }
    enterBtn.parentNode.removeChild(enterBtn);
  },
  drawNextBtn() {
    const nextBtn = document.createElement("button");
    const parentDiv = document.querySelector(".title");
    nextBtn.id = "nextBday";
    nextBtn.className = "button";
    nextBtn.innerHTML = "Next Birthday";
    parentDiv.classList.remove("columns");
    parentDiv.appendChild(nextBtn);
  },
  drawNewBdayBtn() {
    const newBtn = document.createElement("button");
    const parentDiv = document.querySelector(".title");
    newBtn.id = "nextTen";
    newBtn.className = "button";
    newBtn.innerHTML = "Next 10";
    parentDiv.appendChild(newBtn);
  },
  renderBdays(val) {
    const parentElement = document.querySelector(".title");
    const tenList = document.createElement("ul");
    const bdayLi = document.createElement("li");
    bdayLi.innerHTML = val;

    parentElement.appendChild(tenList);
    tenList.appendChild(bdayLi);
  }
};

const handlers = {
  doubleBtnListener() {
    function doubleNum() {
      const { numGenObj } = model;
      const { value } = numGenObj.next();
      view.renderNum(value);
    }
    document.getElementById("numBtn").addEventListener("click", doubleNum);
  },
  enterBdayListener() {
    function enterBday() {
      const monthVal = document.getElementById("monthInput").value - 1;
      const dayVal = document.getElementById("dayInput").value;
      const fieldsNotEmpty = monthVal !== "" && dayVal !== "";

      if (fieldsNotEmpty) {
        const { bdayGen } = model;
        model.bdayGenObj = bdayGen(dayVal, monthVal);
        const { value } = model.bdayGenObj.next();
        view.removeFieldsAndBtn();
        view.drawNextBtn();
        view.drawNewBdayBtn();
        view.renderNextBday(value.format("dddd D MMMM YYYY"));
        handlers.nextBdayListener();
        handlers.nextTenListener();
      }
    }

    document.getElementById("enterBday").addEventListener("click", enterBday);
  },
  nextBdayListener() {
    function nextBday() {
      const { value } = model.bdayGenObj.next();
      view.renderNextBday(value.format("dddd D MMMM YYYY"));
    }
    document.getElementById("nextBday").addEventListener("click", nextBday);
  },
  nextTenListener() {
    function nextTen() {
      const { take } = genFuncs;
      for (const bday of take(10, model.bdayGenObj)) {
        view.renderBdays(bday.format("dddd D MMMM YYYY"));
      }
    }
    document.getElementById("nextTen").addEventListener("click", nextTen);
  }
};

handlers.doubleBtnListener();
handlers.enterBdayListener();
