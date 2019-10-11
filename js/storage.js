let storage = (function () {







	return {
		storeInfo: function (dt, name) {
			let wpm = dt.wpm
			let cpm = dt.cpm
			let accuracy = dt.accuracy
			let nm = name

			$.ajax({
				type: 'POST',
				url: 'backend/savedata.php',
				data: {
					name: nm,
					wpm: wpm,
					cpm: cpm,
					accuracy: accuracy
				},
				success: function (response) {
					console.log(response)
				}
			});
		},





	}
})();