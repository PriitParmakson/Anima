$(document).ready(function() {

  Parse.$ = jQuery;
	// Rakendus Anima
  Parse.initialize("L1njNniNiVV4rCUTO7NwMAWlIX0rSLI5zeBPN9oJ",
                   "IAB9T0Wsd3SLUpp1y6w19kRVH3vpRba4gRlqK9y3");
								 
	// Mudelite ja vaadete klasside ning globaalsete instantside algväärtustamine
	var HarjutuseMudel;
	var SoorituseMudel;
	var HarjutuseVaade, HarjutusteVaade;
	var harjutusteVaade; // instants
	HarjutuseMudel = Parse.Object.extend('Harjutus');
	SoorituseMudel = Parse.Object.extend('Sooritus');
	
	// Nädala algväärtustamine
	var E; // Kuvatava nädala esmaspäev
	algväärtustaNädal();

	// Harjutuste laadimine
	laeHarjutused();
	
	lisaSisenemiseSündmusekäsitleja();
	
});	
