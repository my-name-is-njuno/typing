let data = (function() {
  let testControls = {
    testStarted: false,
    testEnded: false,
    completionTime: 0,
    timeLeft: 0
  };
  let testResultChanges = {
    wpm: 0,
    wpmc: 0,
    cpm: 0,
    cpmc: 0,
    accuracy: 0,
    accuracyChange: 0,
    numberOfCorrectWords: 0,
    numberOfCorrectCharacters: 0,
    numberOfTestCharacters: 0
  };
  let words = {
    currentWordIndex: -1,
    currentWord: {},
    testWords: []
  };
  String.prototype.capitalize = function() {
    var newStr = "";
    var firstCap = this.charAt(0).toLocaleUpperCase();
    var remainingStr = this.slice(1);
    newStr = firstCap + remainingStr;
    return newStr;
  };
  var word = function(x) {
    this.wordValue = {
      correctWord: words.testWords[x] + " ",
      userWord: "",
      isCorrect: false
    };
    this.charValue = {
      correctChar: this.wordValue.correctWord.split(""),
      userChar: [],
      totalCorrect: 0,
      totalTest: this.wordValue.correctWord.length
    };
  };
  word.prototype.update = function(val) {
    // update user value
    // this.userWord = val;
    this.wordValue.userWord = val;

    // update if word is coreect
    this.wordValue.isCorrect =
      this.wordValue.correctWord == this.wordValue.userWord;

    // update users characters
    this.charValue.userChar = this.wordValue.userWord.split("");

    // calculate number of correct chars
    let x = 0;
    let self = this;
    charLoopCallBack = function(cc, index) {
      x += cc === self.charValue.userChar[index] ? 1 : 0;
    };
    // console.log(x);
    this.charValue.correctChar.forEach(charLoopCallBack);
    this.charValue.totalCorrect = x;
    // console.log(this.charValue.totalCorrect);
  };
  let lineReturn = "|";

  let shuffle = function(ar) {
    let arr = [];
    while (ar.length > 0) {
      let ri = Math.floor(Math.random() * ar.length);
      let re = ar[ri];
      arr.push(re);
      ar.splice(ri, 1);
    }
    return arr;
  };

  let capitalizeRandom = function(ar) {
    return ar.map((cw) => {
      let nocw = Math.floor(4 * Math.random());
      return nocw == 3 ? cw.capitalize() : cw;
      // return cw.capitalize();
    });
  };

  let addRandomPunction = function(ar) {
    let pc = [",", ".", "'", "\\", '"', "#", "/", "?"];
    return ar.map((cw) => {
      let np = Math.floor(4 * Math.random());
      let nocp = Math.floor(pc.length * Math.random());
      return np == 3 ? cw + pc[nocp] : cw;
    });
  };

  return {
    getCurrentWordIndex: function() {
      return words.currentWordIndex;
    },

    startTest: function() {
      testControls.testStarted = true;
    },
    setTestStartControls() {
      testControls.testEnded = false;
    },
    getIfTestStarted: function() {
      return testControls.testStarted;
    },
    iniatilizeTimeLeft(tm) {
      testControls.completionTime = tm;
      testControls.timeLeft = tm;
      return testControls.completionTime;
    },

    getTimeLeft: function() {
      return testControls.timeLeft;
    },
    reduceTime: function() {
      testControls.timeLeft -= 1;
      return testControls.timeLeft;
    },
    startCountingDown() {
      setInterval(function() {
        testControls.timeLeft -= 1;
      }, 1000);
    },

    endTest: function() {
      testControls.testEnded = true;
      testControls.testStarted = false;
    },

    setTestContent: function(textNumber) {
      let tw = sentensenses[textNumber];
      let twa = tw.split(" ");
      if (textNumber < 3) {
        // shuffle words
        twa = shuffle(twa);
        twa = capitalizeRandom(twa);
        twa = addRandomPunction(twa);
        // console.log(twa);
      }

      words.testWords = twa;
    },

    getTestContent: function() {
      return words.testWords;
    },

    getLineReturn() {
      return lineReturn;
    },

    moveToNewWord: function() {
      if (words.currentWordIndex > -1) {
        //update the number of correct words
        if (words.currentWord.wordValue.isCorrect == true) {
          testResultChanges.numberOfCorrectWords += 1;
        }
        //update number of correct characters
        testResultChanges.numberOfCorrectCharacters +=
          words.currentWord.charValue.totalCorrect;

        //update number of test characters
        testResultChanges.numberOfTestCharacters +=
          words.currentWord.charValue.totalTest;
      }
      words.currentWordIndex++;
      let currentIndex = words.currentWordIndex;

      let newWord = new word(currentIndex);

      words.currentWord = newWord;
      // console.log(words.currentWord);
    },

    getCurrentWord: function() {
      return words.currentWord;
    },

    getTestEnded: function() {
      return testControls.testEnded;
    },

    updateCurrentWord: function(currentWord) {
      words.currentWord.update(currentWord);
    },

    calculateWordsPerMinute() {
      let oldWpm = testResultChanges.wpm;
      let numberOfCorrectWords = testResultChanges.numberOfCorrectWords;
      // console.log(numberOfCorrectWords);
      if (testControls.timeLeft !== testControls.completionTime) {
        testResultChanges.wpm = Math.round(
          (60 * numberOfCorrectWords) /
            (testControls.completionTime - testControls.timeLeft)
        );
        // console.log(testResultChanges.wpm);
      } else {
        testResultChanges.wpm = 0;
      }

      testResultChanges.wpmc = testResultChanges.wpm - oldWpm;

      return [testResultChanges.wpm, testResultChanges.wpmc];
    },

    calculateCharctersPerMinute() {
      let oldCpm = testResultChanges.cpm;
      let numberOfCorrectCharacters =
        testResultChanges.numberOfCorrectCharacters;
      if (testControls.timeLeft !== testControls.completionTime) {
        testResultChanges.cpm = Math.round(
          (60 * numberOfCorrectCharacters) /
            (testControls.completionTime - testControls.timeLeft)
        );
      } else {
        testResultChanges.cpm = 0;
      }

      testResultChanges.cpmc = testResultChanges.cpm - oldCpm;

      return [testResultChanges.cpm, testResultChanges.cpmc];
    },

    calculateAccuracy() {
      let oldAccuracy = testResultChanges.accuracy;
      let numberOfCorrectCharacters =
        testResultChanges.numberOfCorrectCharacters;
      if (
        testControls.timeLeft !== testControls.completionTime &&
        testResultChanges.numberOfTestCharacters > 0 &&
        numberOfCorrectCharacters > 0
      ) {
        testResultChanges.accuracy = Math.round(
          (100 * numberOfCorrectCharacters) /
            testResultChanges.numberOfTestCharacters
        );
      } else {
        testResultChanges.accuracy = 0;
      }

      testResultChanges.accuracyChange =
        testResultChanges.accuracy - oldAccuracy;

      return [testResultChanges.accuracy, testResultChanges.accuracyChange];
    },

    getCertData: function() {
      return {
        wpm: testResultChanges.wpm,
        cpm: testResultChanges.cpm,
        accuracy: testResultChanges.accuracy
      };
    },

    resetTestControls: function() {

      testResultChanges.wpm = 0;
      testResultChanges.wpmc = 0;
      testResultChanges.cpm = 0;
      testResultChanges.cpmc = 0;
      testResultChanges.accuracy = 0;
      testResultChanges.accuracyChange = 0;
      testResultChanges.numberOfCorrectCharacters = 0;
      testResultChanges.numberOfCorrectWords = 0;
      testResultChanges.numberOfTestCharacters = 0;

      words.currentWordIndex = -1
      words.currentWord = {}
      words.testWords = []



      
    }
  };
})();
