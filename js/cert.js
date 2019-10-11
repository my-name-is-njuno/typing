let cert = (function (data) {
  return {


    generateCert: function (r, name) {

      var doc = new jsPDF();
      doc.addImage(imgData, "JPG", 15, 40, 180, 160);

      //   addd title
      doc.setFont('times')
      doc.setFontType('italic')
      doc.setTextColor(29, 210, 242)
      doc.setFontSize(21)
      doc.text(105, 100, 'TYPING SPEED CERTIFICATE', 'center')

      // add text
      doc.setTextColor(96, 96, 96)
      doc.setFontSize(14)
      doc.text(105, 110, 'This Certificate is Hereby Awarded to', 'center')

      // add name
      doc.setTextColor(29, 210, 242)
      doc.setFontSize(21)
      doc.text(105, 120, name, 'center')

      // add text
      doc.setTextColor(96, 96, 96)
      doc.setFontSize(14)
      doc.text(105, 130, 'For achieving Results below as documented', 'center')
      doc.text(105, 135, 'and verified by TypingIsland ', 'center')




      // add results
      // add text
      doc.setTextColor(96, 96, 96)
      doc.setFontSize(14)
      // doc.text(105,165, 'Level: ' + data.wpm, 'center')
      doc.text(105, 145, 'Average Speed: ' + r.wpm + ' wpm', 'center')
      doc.text(105, 150, 'Accuracy: ' + r.accuracy + '%', 'center')

      // add date

      doc.save(name + ".pdf");
    }
  };
})();