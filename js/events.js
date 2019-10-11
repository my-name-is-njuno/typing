let events = (function (data, ui, storage, cert) {



  let showTopSpeed = function () {

    $.ajax({
      type: 'GET',
      url: 'backend/getusers.php',
      dataType: 'JSON',
      success: function (response) {
        console.log(response)
        ui.fillTopSpeed(response)
      }
    });

  }




  let addEventListenerr = function () {
    // downlad button

    ui.getDomElements().download.addEventListener("click", (e) => {
      if (ui.isEmptyName()) {
        ui.flagNameInput();
      } else {
        let name = escape(ui.getDomElements().nameInput.value.trim())
        let certData = data.getCertData();
        cert.generateCert(certData, name);
        storage.storeInfo(certData, name);
        // location.reload();
      }
    });




    // character typing event

    // enter key
    ui.getDomElements().textInput.addEventListener("keydown", (e) => {
      // e.preventDefault();

      // if test ended, do nothing
      if (data.getTestEnded()) {
        return;
      }

      if (e.keycode == 13) {
        ui.getDomElements().textInput.value += data.getLineReturn() + " ";
        let ie = new Event("input");
        ui.getDomElements().textInput.dispatchEvent(InputEvent);
      }
    });

    ui.getDomElements().textInput.addEventListener("input", launchTest);
    window.addEventListener("resize", ui.scroll());
  };

  let launchTest = function (e) {
    // e.preventDefault();
    // console.log("Key pressed");
    // if test ended, do nothing
    if (data.getTestEnded()) {
      return;
    }

    // if first charater, start test, start countdown
    if (!data.getIfTestStarted()) {
      // start test
      data.startTest();
      // start counter

      let b = setInterval(() => {
        // calculate results

        // update wpm and wpmc
        let results = {};

        [results.wpm, results.wpmc] = data.calculateWordsPerMinute();
        // update cpm and cpmc
        [results.cpm, results.cpmc] = data.calculateCharctersPerMinute();
        // update accuracy and accuracy change
        [results.accuracy, results.accuracyChange] = data.calculateAccuracy();
        // update resuts
        ui.updateResults(results);

        // console.log(results);

        if (data.getTimeLeft() != 0) {
          let tl = data.reduceTime();
          // console.log(tl);
          ui.updateTimeLeft(tl);
        } else {
          clearInterval(b);
          data.endTest();
          ui.getDomElements().restartBtn.style.display = 'block'
          ui.fillModal(results.wpm);
          ui.showModal();
          ui.clearInputAfterFinish()
          ui.disableInput()
        }
        // update time left - if time left reduce by one sec otherwise end test
        // show results
      }, 1000);
    }

    // get typed word
    let typedWord = ui.getTypedWord();
    // console.log(typedWord);

    // update current word
    data.updateCurrentWord(typedWord);

    // format current word
    // console.log(data.getCurrentWord());
    ui.formatCurrentWord(data.getCurrentWord());

    // check if user pressed space or enter
    if (ui.spacePressed(e) || ui.enterPressed(data.getLineReturn())) {
      // empty text input
      ui.emptyInput();

      // deactivate current word
      ui.deactivateCurrentWord();

      // move to a new word,set active word and format it
      data.moveToNewWord();
      var index = data.getCurrentWordIndex();
      ui.highlightCurrentWord(index);
      var cw = data.getCurrentWord();
      ui.formatCurrentWord(cw);

      // scroll new word into view
      ui.scroll();
    }
  };

  return {
    init: function (duration = 60, textNumber = 0, restart = false) {
      // fill content with words
      if (restart) {
        data.resetTestControls()
        data.setTestStartControls()
        ui.enableInput()
        ui.clearModalDiv()
        ui.clearTestResultsDiv()

      }

      data.setTestContent(textNumber);
      let testContent = data.getTestContent();
      ui.fillContentDiv(testContent);

      // hide restart btn
      ui.getDomElements().restartBtn.style.display = 'none'

      //   set time

      // data.iniatilizeTimeLe ft(duration);
      ui.setTimeLeft(data.iniatilizeTimeLeft(duration));

      // update time Left
      ui.updateTimeLeft(data.getTimeLeft());

      // move to firts word
      data.moveToNewWord();

      // highlight first word
      var index = data.getCurrentWordIndex();
      ui.highlightCurrentWord(index);
      var cw = data.getCurrentWord();
      // console.log(cw);
      ui.formatCurrentWord(cw);

      // put focus on input
      ui.putFocusOnInput();


      // 
      showTopSpeed()

      // add event listeners
      addEventListenerr();









    }
  };
})(data, ui, storage, cert);