# AVALIADORES-VINHOS

API criada para demonstrar todos os avaliadores de uma determinada base de dados. E também, mostrar a média, maior e menor nota das avaliações de um avaliador específico

### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

## Dependências
* Express
* Node

## Instalação

Realizar clone do projeto
```bash 
git clone https://github.com/GhabrielFiorotti/AVALIADORES-VINHOS.git
```


Use o gerenciador de pacotes npm para instalar as dependências

```bash
npm install
```

O banco de dados foi configurado remotamente, não sendo necessário nenhuma ação. 

## Execução

Para executar, digite no terminal:

```bash
node api.js
```

O acesso nas rotas é feito da seguinte forma: é necessário listar todos os avaliadores com a rota localhost:3000/avaliadores . Feito isso, basta selecionar um nome e colar na rota localhost:3000/avaliadores/nomeAvaliador (substituir nomeAvaliador por o nome do avaliador escolhido) para descobrir os dados de media das notas, menor e maior

## Teste de complexidade e velocidade de execução

Com o intuito de medir a velocidade de execução, foi criado rotas para medir no pior caso de busca, médio caso de busca, melhor caso de busca, melhor caso de ordenação, médio caso de ordenação e melhor caso de ordenação

