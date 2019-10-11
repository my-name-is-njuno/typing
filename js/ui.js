let ui = (function () {
  let domSelectors = {
    testContent: document.querySelector(".content"),
    completionTime: document.querySelector("#completion-time"),
    timeLeft: document.querySelector("#time-left"),
    activeWord: "",
    testInput: document.querySelector("#test-input"),
    wpm: document.querySelector("#words-per-minutes"),
    wpmc: document.querySelector("#words-per-minutes-change"),
    cpm: document.querySelector("#characters-per-minutes"),
    cpmc: document.querySelector("#characters-per-minutes-change"),
    accuracy: document.querySelector("#accuracy"),
    accuracyChange: document.querySelector("#accuracy-change"),
    modall: document.querySelector("#modal"),
    nameInput: document.querySelector("#name-input"),
    downloadCert: document.querySelector("#get-cert"),
    helpText: document.querySelector("#help-text"),
    restartBtn: document.querySelector("#restart-btn"),
    modalInfo: document.querySelector("#modal-data-goes-here"),
    topSpeed: document.querySelector('#ts')
  };

  let userValue;

  let updateChanges = function (change, domm) {
    // class to add
    let classToAdd, html;
    [classToAdd, html] =
    change > 0 ? ["positive-change", "+" + change] : ["negative-change", "-" + change];

    domm.innerHTML = html;
    domm.removeAttribute("class");
    domm.className = classToAdd;
    fadeElement(domm);
  };

  let fadeElement = function (domm) {
    domm.style.opacity = 1;
    setTimeout(function () {
      domm.style.opacity = 0.9;
    }, 100);
  };

  return {
    fillContentDiv: function (test, lr) {
      let na = test.map((cw) => {
        cw = cw.split("");
        let cww = cw.map((c) => {
          return `<span>${c}</span>`;
        });
        cww = cww.join("");
        cww = `<span>${cww} </span> `;
        return cww;
      });
      na = na.join(" ");
      // console.log(na);
      domSelectors.testContent.innerHTML = na;
    },

    highlightCurrentWord: function (index) {
      domSelectors.activeWord = domSelectors.testContent.children[index];
    },
    putFocusOnInput: function () {
      domSelectors.testInput.focus();
    },
    setTimeLeft: function (tm) {
      domSelectors.completionTime.textContent = tm;
      domSelectors.timeLeft.textContent = tm;
    },
    updateTimeLeft: function (x) {
      domSelectors.timeLeft.textContent = x;
    },

    formatCurrentWord: function (word) {
      let aw = domSelectors.activeWord;
      // highlight by adding class
      aw.className = "active-word";

      // format individual characters
      let correctValue = word.wordValue.correctWord;
      let userValue = word.wordValue.userWord;
      // consoleconsole.log(correctValue);
      // correct value

      let returnCharClass = function (cc, index) {
        if (index < userValue.length) {
          if (cc === userValue[index]) {
            return "correct-character";
          } else {
            return "wrong-character";
          }
        } else {
          return "";
        }
      };

      let classes = Array.prototype.map.call(correctValue, returnCharClass);

      var characters = aw.children;

      for (let i = 0; i < characters.length; i++) {
        characters[i].removeAttribute("class");
        characters[i].className = classes[i];
      }
    },

    updateResults: function (r) {
      // console.log(r);
      domSelectors.cpm.textContent = r.cpm;
      domSelectors.wpm.textContent = r.wpm;
      domSelectors.accuracy.textContent = r.accuracy;

      updateChanges(r.wpmc, domSelectors.wpmc);
      updateChanges(r.cpmc, domSelectors.cpmc);
      updateChanges(r.accuracyChange, domSelectors.accuracyChange);
    },

    getDomElements: function () {
      return {
        textInput: domSelectors.testInput,
        download: domSelectors.downloadCert,
        nameInput: domSelectors.nameInput,
        restartBtn: domSelectors.restartBtn,
      };
    },
    spacePressed: function (e) {
      return e.data === " " ? true : false;
    },
    enterPressed: function (e) {
      return this.getTypedWord().includes(e + " ");
    },
    getTypedWord: function () {
      return domSelectors.testInput.value;
    },

    emptyInput: function (e) {
      domSelectors.testInput.value = "";
    },

    deactivateCurrentWord: function () {
      domSelectors.activeWord.removeAttribute("class");
    },

    scroll: function () {
      let aw = domSelectors.activeWord;
      let distanceFromTop = aw.offsetTop;
      let distanceFromTopContentDiv = domSelectors.testContent.offsetTop;
      let diff = distanceFromTop - distanceFromTopContentDiv;
      domSelectors.testContent.scrollTop = diff;
    },

    showModal: function () {
      $(".modal").modal("show");
    },

    fillModal: function (wpm) {
      let results;

      if (wpm < 40) {
        results = {
          type: "Tortoise",
          image: "tortoise.jpg",
          level: "beginner"
        };
      } else if (wpm > 40 && wpm < 70) {
        results = {
          type: "Horse",
          image: "horse.jpg",
          level: "Average"
        };
      } else {
        results = {
          type: "Puma",
          image: "puma.jpg",
          level: "Expert"
        };
      }

      let html =
        "<div><p>You are a <b>%type%</b> </p>You type at a speed of <b>%speed%</b> words per minutes making you a <b>%level%</b><p></p><img src='images/%imgg%' width='200px' height='200px' class = 'img-thumbnail' alt=''></div>";

      html = html.replace("%type%", results.type);
      html = html.replace("%speed%", wpm);
      html = html.replace("%imgg%", results.image);
      html = html.replace("%level%", results.level);

      domSelectors.modalInfo.innerHTML = html;

      domSelectors.downloadCert.setAttribute("level", results.level);
    },

    isEmptyName: function () {
      return domSelectors.nameInput.value.trim() === "";
    },

    flagNameInput: function () {
      domSelectors.nameInput.style.borderColor = "red";
      domSelectors.helpText.textContent =
        "Enter your name to download certificate";
    },
    clearInputAfterFinish: function () {
      domSelectors.testInput.value = ""
    },
    disableInput: function () {
      domSelectors.testInput.disabled = true
    },
    enableInput: function () {
      domSelectors.testInput.disabled = false
    },
    clearModalDiv: function () {
      domSelectors.modalInfo.innerHTML = ""
    },

    clearTestResultsDiv: function () {
      domSelectors.wpm.textContent = 0
      domSelectors.cpm.textContent = 0
      domSelectors.cpmc.textContent = 0
      domSelectors.wpmc.textContent = 0
      domSelectors.accuracy.textContent = 0
      domSelectors.accuracyChange.textContent = 0
    },



    fillTopSpeed: function (data) {
      let html;
      let n = 1;
      data.forEach((r) => {
        if (typeof r.name !== undefined) {
          if (n < 11) {
            if (n == 1) {
              html += `<li class="list-group-item d-flex justify-content-between align-items-center active">${n}. ${r.name}<span class="badge badge-primary badge-pill">${r.wpm} WPM </span></li>`
            } else {
              html += `<li class="list-group-item d-flex justify-content-between align-items-center">${n}. ${r.name}<span class="badge badge-primary badge-pill">${r.wpm} WPM </span></li>`
            }

          }
          n++;

        }

      });
      domSelectors.topSpeed.innerHTML = html;
    }
  };
})();