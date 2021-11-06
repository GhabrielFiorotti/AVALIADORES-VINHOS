const express = require('express')
var fs = require("fs");

//MÓDULO FS PARA LER O ARQUIVO JSON

var dadosAvaliacao = fs.readFileSync("./dados.json", "utf8", function (err, data) {
  if (err) {
    return console.log("Erro ao ler arquivo");
  }

  return JSON.parse(data); // faz o parse para json

});

dadosAvaliacao = JSON.parse(dadosAvaliacao)


let dadosFormatados = [];



//A FUNÇÃO ABAIXO, VERIFICA SE JÁ EXISTE NO VETOR DE ARRAY, SE SIM, ACRESCENTA NOTA, SE NÃO CRIA OUTRO REGISTRO

function procurarElemento(valor, nota, vetor) {
  for (let index = 0; index < vetor.length; index++) {
    if (vetor[index].nome == valor) {
      vetor[index].notas.push(nota)
      return true;
    }

  }
  let array = {
    "nome": valor,
    "notas": [nota]
  }
  vetor.push(array)
  return true;
}

//PERCORRER ARRAY PARA TRATAR OS DADOS

for (let i = 0; i < dadosAvaliacao.length; i++) {
  procurarElemento(dadosAvaliacao[i].taster_name, dadosAvaliacao[i].points, dadosFormatados);
}


//NO ALGORITMO ABAIXO, UTILIZO A ORDENAÇÃO COM UM WHILE E FOR (MÉTODO RECOMENDADO PARA SUBSTITUIT OS DOIS FOR)

let fim = true;
let aux;

while (fim) {
  fim = false;
  for (let i = 0; i < dadosFormatados.length - 1; i++) {
    if (dadosFormatados[i].nome > dadosFormatados[i + 1].nome) {
      aux = dadosFormatados[i];
      dadosFormatados[i] = dadosFormatados[i + 1];
      dadosFormatados[i + 1] = aux;
      fim = true;
    }
  }
}

//FUNÇÃO CRIADA PARA BUSCA BINÁRIA, NO QUAL IRÁ ACHAR A POSIÇÃO DO AVALIADOR QUE ESTÁ SENDO PROCURADO- EM MEIO AOS OUTROS, E FAZER A MÉDIA 

function descobrirPosicao(valorProcurado) {

  let achou = false;
  let min = 0;
  let max = dadosFormatados.length - 1;

  while (achou == false) {
    let meioLista = Math.ceil(((min + max) / 2));
    if (dadosFormatados[meioLista].nome == valorProcurado) {
      achou = true;
      return meioLista;
    }
    else if (dadosFormatados[meioLista].nome < valorProcurado) {
      min = meioLista + 1;
    }
    else if (dadosFormatados[meioLista].nome > valorProcurado) {
      max = meioLista - 1
    }
  }
}


//A FUNÇÃO ABAIXO SERÁ CHAMADA PARA FAZER A MÉDIA DE ACORDO COM O AVALIADOR SELECIONADO

function notaMedia(posicao) {
  let soma = 0;
  for (let x in dadosFormatados[posicao].notas) {
    soma += parseInt(dadosFormatados[posicao].notas[x]);
  }
  let media = soma / dadosFormatados[posicao].notas.length
  return media;
}


//FUNÇÃO PARA ORDENAR AS NOTAS DE UM DETERMINADO AVALIADOR ATRAVÉS DA POSIÇÃO DELE NO ARRAY GERAL

function ordenarNotasDeAcordoComUmAvaliador(posicao) {
  let final = true;
  let auxi;
  while (final) {
    final = false;
    for (let i = 0; i < dadosFormatados[posicao].notas.length -1; i++) {
      if (dadosFormatados[posicao].notas[i] > dadosFormatados[posicao].notas[i + 1]) {
        auxi = dadosFormatados[posicao].notas[i];
        dadosFormatados[posicao].notas[i] = dadosFormatados[posicao].notas[i + 1];
        dadosFormatados[posicao].notas[i + 1] = auxi;
        final = true;
      }
    }
  }
}

function ordenarDecrescenteParaTeste(posicao) {
  let final = true;
  let auxi;
  while (final) {
    final = false;
    for (let i = 0; i < dadosFormatados[posicao].notas.length -1; i++) {
      if (dadosFormatados[posicao].notas[i] < dadosFormatados[posicao].notas[i + 1]) {
        auxi = dadosFormatados[posicao].notas[i];
        dadosFormatados[posicao].notas[i] = dadosFormatados[posicao].notas[i + 1];
        dadosFormatados[posicao].notas[i + 1] = auxi;
        final = true;
      }
    }
  }
}


console.log(dadosFormatados)

//FUNÇÃO CRIADA PARA RETORNAR TODOS OS AVALIADORES

function avaliadores() {
  const avaliadores = [];
  for (let index = 0; index < dadosFormatados.length -1; index++) {
    avaliadores.push(dadosFormatados[index].nome);
  }
  return avaliadores;
}



const app = express()

//ROTA PARA PEGAR TODOS OS AVALIADORES

app.get('/avaliadores', function (req, res) {
  res.json(avaliadores())
})

//ROTA PARA PEGAR A MEDIA, MAIOR E MENOR NOTA DO TOTAL DE AVALIAÇÕES DE UM DETERMINADO AVALIADOR

app.get('/avaliadores/:nomeAvaliador', function (req, res) {
  let posicao = descobrirPosicao(req.params.nomeAvaliador)
  ordenarNotasDeAcordoComUmAvaliador(posicao)
  let mediaNota = notaMedia(posicao);
  console.log(dadosFormatados[posicao].notas)
  let maiorNota = dadosFormatados[posicao].notas[dadosFormatados[posicao].notas.length - 1]
  let menorNota = dadosFormatados[posicao].notas[0]

  res.send("A média de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + mediaNota + "\n A maior nota de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + maiorNota + "\nA menor nota de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + menorNota)
})


app.listen(3000)
console.log("Rodando na porta 3000")




////////////////////////////////////////////////////////////////////////////////////////
//             TESTAR VELOCIDADE ORDENAÇÃO DE NOTAS NO PIOR CASO:                     //
//AS ROTAS ABAIXO FORAM CRIADAS PARA TESTAR A VELOCIDADE NOS PIOR, MÉDIO E MELHOR CASO//
////////////////////////////////////////////////////////////////////////////////////////

//TESTANDO PIOR CASO, MÉDIO CASO E MELHOR CASO PARA ALGORITMO DE ORDENAÇÃO


//ROTA PARA PIOR CASO DE ORDENAÇÃO
app.get('/piorCasoOrdenacao/:nomeAvaliador', function (req, res) {
  let posicao = descobrirPosicao(req.params.nomeAvaliador)

  //ORDENANDO DECRESCENTE PARA TESTE (PARA CALCULAR O TEMPO DE ORDENAÇÃO NO PIOR CASO)
  ordenarDecrescenteParaTeste(posicao)

  console.time("Tempo pior caso de ordenação")
  ordenarNotasDeAcordoComUmAvaliador(posicao)
  console.timeEnd("Tempo pior caso de ordenação")
  let mediaNota = notaMedia(posicao);
  let maiorNota = dadosFormatados[posicao].notas[dadosFormatados[posicao].notas.length - 1]
  let menorNota = dadosFormatados[posicao].notas[0]
  res.send("A média de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + mediaNota + "\n A maior nota de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + maiorNota + "\nA menor nota de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + menorNota)
})


//ROTA PARA MÉDIO CASO DE ORDENAÇÃO
app.get('/medioCasoOrdenacao/:nomeAvaliador', function (req, res) {
  let posicao = descobrirPosicao(req.params.nomeAvaliador)
  console.time("Tempo médio caso de ordenação")

  //NO MÉDIO CASO, SÃO OS DADOS NATURALMENTE ESPALHADOS
  ordenarNotasDeAcordoComUmAvaliador(posicao)

  console.timeEnd("Tempo médio caso de ordenação")
  let mediaNota = notaMedia(posicao);
  let maiorNota = dadosFormatados[posicao].notas[dadosFormatados[posicao].notas.length - 1]
  let menorNota = dadosFormatados[posicao].notas[0]

  res.send("A média de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + mediaNota + "\n A maior nota de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + maiorNota + "\nA menor nota de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + menorNota)
})


//ROTA PARA MELHOR CASO DE ORDENAÇÃO
app.get('/melhorCasoOrdenacao/:nomeAvaliador', function (req, res) {
  let posicao = descobrirPosicao(req.params.nomeAvaliador)

  //ORDENANDO CRESCENTE PARA TESTE (PARA CALCULAR O TEMPO DE ORDENAÇÃO NO MELHOR CASO)
  ordenarNotasDeAcordoComUmAvaliador(posicao)

  console.time("Tempo melhor caso de ordenação")
  ordenarNotasDeAcordoComUmAvaliador(posicao)
  console.timeEnd("Tempo melhor caso de ordenação")
  let mediaNota = notaMedia(posicao);
  let maiorNota = dadosFormatados[posicao].notas[dadosFormatados[posicao].notas.length - 1]
  let menorNota = dadosFormatados[posicao].notas[0]
  res.send("A média de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + mediaNota + "\n A maior nota de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + maiorNota + "\nA menor nota de avaliações do(a) avaliador(a) " + req.params.nomeAvaliador + " é " + menorNota)
})




//TESTANDO PIOR CASO, MÉDIO CASO E MELHOR CASO PARA ALGORITMO DE BUSCA


//ROTA PARA PIOR CASO DE BUSCA
app.get('/piorCasoBusca', function (req, res) {

  console.time("Tempo pior caso de busca")
  //PEGANDO POSICÃO NO PIOR CASO
  let posicao = descobrirPosicao("Alexander Peartree")
  console.timeEnd("Tempo pior caso de busca")
  res.send("Teste de tempo no pior caso de busca")

})


//ROTA PARA MÉDIO CASO DE BUSCA
app.get('/medioCasoBusca', function (req, res) {

  console.time("Tempo médio caso de busca")
  //PEGANDO POSICÃO NO MÉDIO CASO
  let posicao = descobrirPosicao("Fiona Adams")
  console.timeEnd("Tempo médio caso de busca")
  res.send("Teste de tempo no médio  caso de busca")

})


//ROTA PARA MELHOR CASO DE BUSCA
app.get('/melhorCasoBusca', function (req, res) {

  console.time("Tempo melhor caso de busca")
  //PEGANDO POSICÃO NO MELHOR CASO
  let posicao = descobrirPosicao("Matt Kettmann")
  console.timeEnd("Tempo melhor caso de busca")
  res.send("Teste de tempo no melhor caso de busca")

})



/*

RESULTADOS DOS TESTES:

PIOR CASO ORDENAÇÃO
1º TESTE: 0.578ms
2º TESTE: 7.059ms
3º TESTE: 5.684ms
4º TESTE: 0.035ms

MÉDIO CASO ORDENAÇÃO
1º TESTE: 0.38ms
2º TESTE: 0.022ms
3º TESTE: 0.041ms
4º TESTE: 0.017ms

MELHOR CASO ORDENAÇÃO
1º TESTE: 0.012ms
2º TESTE: 0.021ms
3º TESTE: 0.012ms
4º TESTE: 0.016ms



PIOR CASO BUSCA
1º TESTE: 0.016ms
2º TESTE: 0.011ms
3º TESTE: 0.03ms
4º TESTE: 0.011ms

MÉDIO CASO BUSCA
1º TESTE: 0.011ms
2º TESTE: 0.009ms
3º TESTE: 0.015ms
4º TESTE: 0.022ms

MELHOR CASO BUSCA
1º TESTE: 0.007ms
2º TESTE: 0.008ms
3º TESTE: 0.021ms
4º TESTE: 0.013ms

*/

// NOTAÇÃO BIG-O CONSIDERANDO O PIOR CASO: f(n) = 3n^2 + n + log(n)
