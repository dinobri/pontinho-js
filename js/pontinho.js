/* ========================================= MODELO ========================================= */
function Jogador(nome, saldo){
	this.nome = nome;
	this.saldo = saldo;
	this.pontRodada = 0;
	this.pontGeral = 0;
}

/* ========================================= UTIL ========================================= */
var jogadores = [];
jogadores.push(new Jogador("Lorem Dolor", 2));
jogadores.push(new Jogador("Ipsum Sit", 5));
jogadores.push(new Jogador("Dolor Amet", 3));
jogadores.push(new Jogador("Sit Lorem", 2));
jogadores.push(new Jogador("Amet Ipsum", 2));


/* ========================================= CONTROLE ========================================= */
var app = angular.module('pontinho', []);

app.controller('JogadoresController', function(){
	this.jogadores = jogadores;
});