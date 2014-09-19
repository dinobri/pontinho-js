/* ========================================= MODELO ========================================= */
function Jogador(nome, saldo){
	this.nome = nome;
	this.saldo = saldo;
	this.pontRodada = 0;
	this.pontGeral = 0;

	this.isEstourado = false;

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


/* ========================================= CONTROLE ========================================= */
var app = angular.module('pontinho', ['ngAnimate']);

app.controller('MesaController', function(){
	this.jogadores = jogadores;

	this.novoJogador = new Jogador();

	this.isAdicionando = false;
	this.isAdicionandoAlerta = false;

	this.isAlertando = false;

	this.alteraPontuacao = function(jogador, valor){
		var pontuacaoFinal = jogador.pontRodada + valor;
		if(pontuacaoFinal > 100 || pontuacaoFinal < 0){
			jogador.pontRodada = (pontuacaoFinal > 100) ? 100 : 0;
			return false;
		} else {
			jogador.pontRodada += valor;
		}
	};

	this.habilitaFormNovoJogador = function(){
		console.log("Teste");
		this.isAdicionando = true;
		var input = document.getElementById("novo-nome");
		console.log(input);
		input.focus();
	}

	this.adicionaJogador = function(){
		if(this.novoJogador.nome && this.novoJogador.saldo){
			this.jogadores.push(this.novoJogador);
			this.novoJogador = new Jogador();
			this.isAdicionando = false;			
		} else {
			this.isAdicionandoAlerta = true;
			this.cancelaAdicao();
		}
	};

	this.cancelaAdicao = function(){
		this.novoJogador = new Jogador();
		this.isAdicionando = false
	};

	this.removeJogador = function(jogador){
		var index = this.jogadores.indexOf(jogador);
		console.log(index);
		if(index >= 0){
			this.jogadores.splice(index, 1);
		}
	};

	this.iniciaRodada = function(){
		var maiorPontuacao = 0;

		// Soma pontuação da rodada a pontGeral	
		for(var i = 0; i < this.jogadores.length; i++){
			var jogador = jogadores[i];
			var pontuacaoFinal = jogador.pontRodada + jogador.pontGeral;
			if(pontuacaoFinal >= 100){
				jogador.isEstourado = true;
			} else {
				jogador.pontGeral = pontuacaoFinal;
				
				//verifica maior pontuação
				maiorPontuacao = (jogador.pontGeral > maiorPontuacao) ? jogador.pontGeral : maiorPontuacao;
			}
			jogador.pontRodada = 0;
		}

		//verifica maior pontuação
		for(var i = 0; i < this.jogadores.length; i++){
			var jogador = jogadores[i];
			if(jogador.isEstourado){
				jogador.pontGeral = maiorPontuacao;
			}
		}
	};
});