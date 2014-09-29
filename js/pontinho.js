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
	this.reiniciaPontuacao = function(){
		this.pontRodada = 0;
		this.pontGeral = 0;
		this.isEstourado = false;
	};

	this.debitaSaldo = function(debito){
		this.saldo -= debito;
	};

	this.creditaSaldo = function(credito){
		this.saldo += credito;
	};
}

function Jogo(){
	this.valorFicha = 0.1;		//em R$
	this.valorLagrima = 1;		//em ficha
	this.valorEstourada = 2;	//em ficha
	this.bolao = 0;

	this.isIniciado = false;

	this.adicionaEstourada = function(){
		this.bolao += this.valorEstourada;
	};

	this.lagrimaToDinheiro = function(){
		return this.valorFicha * this.valorLagrima;
	};
	this.estouradaToDinheiro = function(){
		return this.valorFicha * this.valorEstourada;
	};
}

/* ========================================= UTIL ========================================= */
var jogadores = [];
jogadores.push(new Jogador("Lorem Dolor", 2));
jogadores.push(new Jogador("Ipsum Sit", 5));
jogadores.push(new Jogador("Amet Lorem", 3));
jogadores.push(new Jogador("Painho Lorem", 4));


/* ========================================= CONTROLE ========================================= */
var app = angular.module('pontinho', ['ngAnimate']);

app.controller('MesaController', function($scope, $timeout){
	this.jogadores = jogadores;

	this.novoJogador = new Jogador();

	this.isAdicionando = false;
	this.isAdicionandoAlerta = false;

	// ALERTAS
	this.isAlertando = false;
	this.tituloAlerta = "";
	this.msgAlerta = "";


	this.jogo = new Jogo();
	this.minJogadores = 4;

	// Impede que a pontuação seja alterada para menos de 0 ou mais que 100
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
		this.isAdicionando = true;

		$timeout(function(){
			document.getElementById("novo-nome").focus();
		}, 100);
	}

	this.adicionaJogador = function(){
		if(this.novoJogador.nome && this.novoJogador.saldo){
			this.jogadores.push(this.novoJogador);
			this.novoJogador = new Jogador();
			this.isAdicionando = false;			
		} else {
			// this.isAdicionandoAlerta = true;
			this.mostraAlerta("Atenção!", "Preencha os campos para adicionar um novo jogador.");
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

	this.encerraJogo = function(){
		this.jogo.bolao = 0;

		for(var i = 0; i < this.jogadores.length; i++){
			var jogador = this.jogadores[i];
			jogador.reiniciaPontuacao();
		}
		
		this.jogo.isIniciado = false;
	}

	this.iniciaJogo = function(){
		if (!this.jogo.valorFicha || 
		!this.jogo.valorLagrima || 
		!this.jogo.valorEstourada ||
		this.jogadores.length < this.minJogadores) {

			this.mostraAlerta("Atenção!", "Preencha os dados do jogo corretamente para dar início ao mesmo.");
			return false;
		} else {
			this.jogo.isIniciado = true;
			for(var i = 0; i < this.jogadores.length; i++){
				var jogador = this.jogadores[i];
				jogador.debitaSaldo(this.jogo.lagrimaToDinheiro());				
				jogador.debitaSaldo(this.jogo.estouradaToDinheiro());
				this.jogo.bolao += this.jogo.valorEstourada;			
			}
		}
	};

	this.iniciaRodada = function(){
		var vencedor = this.verificaVencedor(this.jogadores);
		
		if(!vencedor){
			return false;
		} else {			
			vencedor.creditaSaldo(this.jogo.lagrimaToDinheiro() * this.jogadores.length);
			// Soma pontuação da rodada a pontGeral	de cada jogador
			var maiorPontuacao = 0;
			var estourados = 0;
			for(var i = 0; i < this.jogadores.length; i++){
				var jogador = this.jogadores[i];
				var pontuacaoFinal = jogador.pontRodada + jogador.pontGeral;
				if(pontuacaoFinal >= 100){
					jogador.isEstourado = true;
					estourados++;
				} else {
					jogador.pontGeral = pontuacaoFinal;
					
					//verifica maior pontuação
					maiorPontuacao = (jogador.pontGeral > maiorPontuacao) ? jogador.pontGeral : maiorPontuacao;
				}

				if(estourados === this.jogadores.length-1){
					vencedor.creditaSaldo(this.jogo.estouradaToDinheiro() * this.jogo.bolao);
					// TODO modal do vencedor
					return this.encerraJogo();
				}

				jogador.pontRodada = 0;
			}

			//aplica maior pontuação aos estourados
			for(var i = 0; i < this.jogadores.length; i++){
				var jogador = this.jogadores[i];
				if(jogador.isEstourado){
					jogador.debitaSaldo(this.jogo.estouradaToDinheiro());
					this.jogo.adicionaEstourada();
					jogador.pontGeral = maiorPontuacao;
					jogador.isEstourado = false;
				}

				jogador.debitaSaldo(this.jogo.lagrimaToDinheiro());
			}
		}		
	};

	// Verifica se houve um (e apenas um) vencedor
	this.verificaVencedor = function(jogadores){
		var vencedor = 0;
		
		for(var i = 0; i < jogadores.length; i++){
			var jogador = this.jogadores[i];
			
			if(jogador.pontRodada === 0){
				if(!vencedor){
					vencedor = jogador;
				} else {
					// TODO alerta
					this.mostraAlerta("Quem bateu?", " Há mais de uma pessoa com 0 pontos.");

					return false;
				}
			}
		}

		if(vencedor === 0){
			// TODO alerta
			this.mostraAlerta("Quem bateu?", "Não há ninguem com 0 pontos.");
			return false;
		} else {
			return vencedor;
		}
	};

	this.mostraAlerta = function(titulo, mensagem){
		this.msgAlerta = mensagem;
		this.tituloAlerta = titulo;
		this.isAlertando = true;
	};

	this.escondeAlerta = function(){
		this.isAlertando = false;
	};
});