/* ========================================= MODELO ========================================= */
function Jogador(nome, saldo){
	this.nome = nome;
	this.saldo = saldo;
	this.pontRodada = 0;
	this.pontGeral = 0;

	/*Métodos*/
	this.atualizaPontuacao = function(valor){
		if(valor<0){
			return false;
		} else {
			this.pontGeral += valor;
			if(this.pontGeral > 100){
				return 100;
			} else {
				return this.pontGeral;
			}
		}
	};
}

/* ========================================= UTIL ========================================= */
var jogadores = [];
jogadores.push(new Jogador("Lorem Dolor", 2));
jogadores.push(new Jogador("Ipsum Sit", 5));
jogadores.push(new Jogador("Dolor Amet", 3));
jogadores.push(new Jogador("Sit Lorem", 2));
jogadores.push(new Jogador("Amet Ipsum", 2));


/* ========================================= CONTROLE ========================================= */
var app = angular.module('pontinho', ['ngAnimate']);

app.controller('MesaController', function(){
	this.jogadores = jogadores;

	this.novoJogador = new Jogador();

	this.isAdicionando = false;

	this.alteraPontuacao = function(jogador, valor){
		var pontuacaoFinal = jogador.pontRodada + valor;
		if(pontuacaoFinal > 100 || pontuacaoFinal < 0){
			return false;
		} else {
			jogador.pontRodada += valor;
		}
	};

	this.adicionaJogador = function(){
		this.jogadores.push(this.novoJogador);
		this.novoJogador = new Jogador();

		this.isAdicionando = false;
	};

	this.removeJogador = function(jogador){
		var index = this.jogadores.indexOf(jogador);
		console.log(index);
		if(index >= 0){
			this.jogadores.splice(index, 1);
		}


	};
});