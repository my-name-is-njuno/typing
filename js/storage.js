let storage = (function () {







	return {
		storeInfo: function (dt, name) {
			let wpm = dt.wpm
			let nm = name

			$.ajax({
				type: 'POST',
				url: 'backend/savedata.php',
				data: {
					name: nm,
					wpm: wpm
				},
				success: function (response) {
					console.log(response)
				}
			});
		},





	}
})();