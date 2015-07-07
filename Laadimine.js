
//// Harjutuste laadimine ///////////////////////
function laeHarjutused() {
	HarjutuseMudel = Parse.Object.extend('Harjutus');
	
	HarjutuseVaade = Parse.View.extend({
		tagName: 'tr',
		template: _.template($('#tabeliReaTempliit').html()),
		events: {},
		initialize: function() {
			_.bindAll(this, 'render'); 
		},
		render: function() {
			var a = JSON.stringify(this.model);
			var b = JSON.parse(a);

			$(this.el).html(this.template(b));
			return this; // Aheldamise võimaldamiseks		
		}
	});
			
	HarjutusteVaade = Parse.View.extend({
		el: '#HarjutusteVaade',
		initialize: function(options) { 
			var self = this; // Praegu seda ei kasuta
			_.bindAll(this, 'kuvaHarjutus', 'laeHarjutused');                       
			this.laeHarjutused();
		},   
		// Loeb harjutused Parse-st
		laeHarjutused: function() {
			var query = new Parse.Query(HarjutuseMudel);
			query.descending('sooritusi');
			var self = this; // Sest anonüümses funktsioonis kontekst muutub
			query.find({
				success: function(harjutused) {
					// console.log('Leitud ' + harjutused.length + ' harjutust');
					self.kuvaHarjutused(harjutused);
					//// Harjutused kuvatud; kuva sooritused ////
					laeSooritused();
					lisaSündmusekäsitlejadSooritustele();
				},
				error: function(viga) {
					console.log('Viga: ' + viga.code + ' ' + viga.message);
				}
			});									 
		},
		// Kõigi harjutuste kuvamine
		kuvaHarjutused: function(harjutused) {
			harjutused.forEach(this.kuvaHarjutus);			
		},
		// Ühe harjutuse kuvamine
		kuvaHarjutus: function(harjutus) { 
			var harjutuseVaade = new HarjutuseVaade({model: harjutus}); // !!!!!!!!!!!
			// HTML joonistatakse ja lisatakse
			this.$el.append(harjutuseVaade.render().el); // 
			// juurelement luuakse render-is, tagastatakse ja lisatakse DOM-i!
		}						
	});

	harjutusteVaade = new HarjutusteVaade(); // Instantsi loomine käivitab			
	
}

//// Soorituste laadimine ////////
function puhastaSooritused() {
	$('.sooritus').html('');
}

function koostaNädalapäevaOtsistring(nädalapäev) { // 1-7
	var J = new Date(+E); // Kloonimine numbriga
	J.setDate(J.getDate() + (nädalapäev - 1));

	var kuu = J.getMonth() + 1;
	if (kuu < 10) { kuu = '0' + kuu; }
	else { kuu = kuu.toString(); }

	var päev = J.getDate();
	if (päev < 10) { päev = '0' + päev; }
	else { päev = päev.toString(); }
	
	var otsistring = J.getFullYear().toString() + kuu + päev;
	// console.log(otsistring);
	return otsistring
}

function laeSooritused() {
	var SoorituseMudel = Parse.Object.extend('Sooritus');
	for (var i = 0; i < 7; i++) { // 7 päeva jaoks		
		var otsistring = koostaNädalapäevaOtsistring(i + 1);
		laePäevaSooritused(i + 1, otsistring, SoorituseMudel);
	}
}

function laePäevaSooritused(nädalapäevaNr, otsistring, mudel) {
	var query = new Parse.Query(mudel);
	query.equalTo('kuup', otsistring);
	query.find({
		success: function(sooritused) {
			// console.log('Nädalapäev: ' + nädalapäevaNr + ' Leitud ' + sooritused.length + ' sooritust');
			for (i = 0; i < sooritused.length; i++) {
				kuvaPäevaSooritus(nädalapäevaNr, sooritused[i]);
			}
		},
		error: function(viga) {
			console.log('Viga: ' + viga.code + ' ' + viga.message);
		}
	});
}

function kuvaPäevaSooritus(nädalapäevaNr, sooritus) {
	var a = JSON.stringify(sooritus);
	var b = JSON.parse(a);
	// Leida tabelirida, mille esimese td id = sooritus.harjutusP.objectId
	var lahter = $('#' + b.harjutusP.objectId);
	// Liigu õige lahtrini
	for (var i = 0; i < nädalapäevaNr; i++) {
			lahter = lahter.next();
	}
	lahter.html(b.maht);
	// Säilita soorituse objectId lahtri id-na
	lahter.attr('id', b.objectId);
}
