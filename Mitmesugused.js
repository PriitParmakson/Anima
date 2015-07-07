function lisaSündmusekäsitlejadSooritustele() {
	$('.sooritus').dblclick( function() {
		
		// Kui sisestusväli on juba avatud, siis mitte reageerida (mitte üheski lahtris)
		// Vt https://learn.jquery.com/using-jquery-core/faq/how-do-i-test-whether-an-element-exists/ 
		if ($('#sisestus').length) {
			return
		}
		
		// Kui pole sisse logitud, siis mitte reageerida
		if (!Parse.User.current()) {
			return
		}
		
		// Loe väärtus - kui on - ja ava input väli
		var senine = $(this).html();
		// Säilita senine peidetud väljas
		$(this).html('<span id="senine">' + senine + '</span>' + 
			'<input id="sisestus" type="text" size="5">');
		$('#sisestus').val(senine).focus();	
		$('#sisestus').keyup(function (e) {
			if (e.keyCode == 13) { // Enter
				var senine = $('#senine').html();
				var uus = $('#sisestus').val();
				// Salvesta uus väärtus
				var nädalapäev = $(this).parent().index();
				var soorituseId = $(this).parent().attr('id');
				var harjutuseID = $(this).parent().parent().children().first().attr('id');
				// Salvesta harjutuseID, nädalapäev, uus
				salvestaSooritus(harjutuseID, nädalapäev, senine, uus, soorituseId);
				// Sea uus väärtus
				$(this).parent().html(uus);
				return
			}
			if (e.keyCode == 27) { // Escape
				var senine = $('#senine').html();
				$(this).parent().html(senine);
			}
		});
	});
}

function salvestaSooritus(harjutuseID, nädalapäev, senine, uus, soorituseId) {
	// console.log('salvestaSooritus: ' + 'harjutuseID: ' + harjutuseID + 
	//	' nädalapäev: ' + nädalapäev + ' uus: ' + uus);

	var Sooritus = Parse.Object.extend('Sooritus');
	
	if (soorituseId) { // Kirjuta üle
			var query = new Parse.Query(Sooritus);
			query.get(soorituseId, {
				success: function(sooritus) {
					sooritus.set('maht', uus);
					sooritus.save(null, {
						success: function(sooritus) {
							console.log('Üle kirjutatud.');
						},
						error: function(sooritus, error) {
							console.log('Viga: ' + error.message);
						}
					});
				},
				error: function(object, error) {
					console.log('Viga: ' + error.message);
				}
			});
	}
	else { // Lisa uus sooritus
		var sooritus = new Sooritus();
		
		sooritus.set('kuup', koostaNädalapäevaOtsistring(nädalapäev));
		
		var harjutus = new HarjutuseMudel();
		harjutus.id = harjutuseID;
		sooritus.set('harjutusP', harjutus);

		sooritus.set('maht', uus);
		
		sooritus.save(null, {
			success: function(sooritus) {
				console.log('Salvestatud.');
			},
			error: function(sooritus, error) {
				console.log('Viga: ' + error.message);
			}
		});		
	}

}

// Sisenemine
function lisaSisenemiseSündmusekäsitleja() {
	$('#sisenemisvorm').on('submit', function(e) {
	 
		// Prevent Default Submit Event
		e.preventDefault();
 
		// Get data from the form and put them into variables
		var data = $(this).serializeArray(),
			username = data[0].value,
			password = data[1].value;
 
		// Call Parse Login function with those variables
		Parse.User.logIn(username, password, {
			// If the username and password matches
			success: function(user) {
				$('#sisselogimine').toggle();
				$('#sisseLogitud').toggle();
			},
			// If there is an error
			error: function(user, error) {
					console.log(error);
			}
		});
	});	
	
}
