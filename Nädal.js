// http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

function algväärtustaNädal() {
	var täna = new Date(); 	// Tänane kuupäev
	$('#nädalaNumber').html(täna.getWeekNumber().toString());
	var tänaneNädalapäev = täna.getDay(); // 0-6
	if (tänaneNädalapäev == 0) { tänaneNädalapäev = 7; }
	E = new Date(); // Kuvatava nädala esmaspäev
	E.setDate(täna.getDate() + 1 - tänaneNädalapäev);
	// var P = new Date();
	// P.setDate(täna.getDate() + 7 - tänaneNädalapäev);
	kuvaNädalapäevad();		
	lisaSündmusekäsitlejadKerimisnuppudele();
}

// Kuva nädala kuupäevad alatest E-st
function kuvaNädalapäevad() {
	var J = new Date(+E); // Kloonimine numbriga
	for (var i = 0; i < 7; i++) {
		$('#p' + (i + 1)).html(J.getDate() + '.' + (J.getMonth() + 1));
		J.setDate(J.getDate() + 1);
	}	
}

// Nädala kerimisnupud
function lisaSündmusekäsitlejadKerimisnuppudele() {
	$('#eelmineNädal').click( function() {
		E.setDate(E.getDate() - 7);
		// Vähenda nädala numbrit
		var nädalaNumber = parseInt($('#nädalaNumber').html()) - 1;
		$('#nädalaNumber').html(nädalaNumber.toString());
		kuvaNädalapäevad();
		puhastaSooritused();
		laeSooritused();
	});
	$('#järgmineNädal').click( function() {
		E.setDate(E.getDate() + 7);
		// Suurenda nädala numbrit
		var nädalaNumber = parseInt($('#nädalaNumber').html()) + 1;
		$('#nädalaNumber').html(nädalaNumber.toString());
		kuvaNädalapäevad();
		puhastaSooritused();
		laeSooritused();
	});		
}
