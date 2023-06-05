const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de pergunta vazia', () => {
  modelo.cadastrar_pergunta('');
  const pergunta = modelo.listar_perguntas(); 
  expect(pergunta[0].texto).toBe('');
});

test('Testando cadastro de resposta', () => {
  modelo.cadastrar_resposta(1, 'Resposta 1');
  modelo.cadastrar_resposta(1, 'Resposta 2');
  const respostas = modelo.get_respostas(1);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('Resposta 1');
  expect(respostas[1].texto).toBe('Resposta 2');
});

test('Testando busca de pergunta por ID', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  const perguntas = modelo.get_pergunta(1);
  expect(perguntas.texto).toBe('1 + 1 = ?');
});

test('Testando busca de respostas por ID da pergunta', () => {
  modelo.cadastrar_pergunta('Qual é a capital do Brasil?');
  modelo.cadastrar_resposta(1, 'Brasília');
  modelo.cadastrar_resposta(1, 'Rio de Janeiro');
  const respostas = modelo.get_respostas(1);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe('Brasília');
  expect(respostas[1].texto).toBe('Rio de Janeiro');
});

test('Testando contagem de respostas por ID da pergunta', () => {
  modelo.cadastrar_pergunta('Qual é a capital do Brasil?');
  modelo.cadastrar_resposta(1, 'Brasília');
  modelo.cadastrar_resposta(1, 'Rio de Janeiro');
  const numRespostas = modelo.get_num_respostas(1);
  expect(numRespostas).toBe(2);
});
