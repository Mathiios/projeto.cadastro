document.getElementById("formCadastro").addEventListener("submit", function (e) {
  e.preventDefault();
  if (validarFormulario()) {
    alert("Usuário cadastrado com sucesso!");
    limparFormulario();
  }
});

function toggleSenha(id) {
  const campo = document.getElementById(id);
  campo.type = campo.type === "password" ? "text" : "password";
}

function validarFormulario() {
  let valido = true;

  const nome = document.getElementById("nome");
  const cpf = document.getElementById("cpf");
  const login = document.getElementById("login");
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const confirmarSenha = document.getElementById("confirmarSenha");
  const salario = document.getElementById("salario");
  const dependentes = document.getElementById("dependentes");

  const campos = [nome, cpf, login, email, senha, confirmarSenha, salario, dependentes];
  const spans = ["erroNome", "erroCPF", "erroLogin", "erroEmail", "erroSenha", "erroConfirmarSenha", "erroSalario", "erroDependentes"];

  spans.forEach(id => document.getElementById(id).textContent = "");

  // Nome
  if (nome.value.trim().length < 3) {
    setErro(nome, "erroNome", "Mínimo de 3 caracteres.");
    valido = false;
  } else setValido(nome);

  // CPF
  const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!regexCPF.test(cpf.value)) {
    setErro(cpf, "erroCPF", "Formato inválido. Use 000.000.000-00.");
    valido = false;
  } else setValido(cpf);

  // Login
  const regexLogin = /^[A-Za-z0-9._-]{4,}$/;
  if (!regexLogin.test(login.value)) {
    setErro(login, "erroLogin", "Login inválido. Mínimo 4 caracteres.");
    valido = false;
  } else setValido(login);

  // Email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regexEmail.test(email.value)) {
    setErro(email, "erroEmail", "E-mail inválido.");
    valido = false;
  } else setValido(email);

  // Senha
  const regexSenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!regexSenha.test(senha.value)) {
    setErro(senha, "erroSenha", "Mínimo 8 caracteres, 1 letra e 1 número.");
    valido = false;
  } else setValido(senha);

  // Confirmar Senha
  if (confirmarSenha.value !== senha.value || confirmarSenha.value === "") {
    setErro(confirmarSenha, "erroConfirmarSenha", "Senhas não coincidem.");
    valido = false;
  } else setValido(confirmarSenha);

  // Salário
  if (parseFloat(salario.value) <= 0 || isNaN(parseFloat(salario.value))) {
    setErro(salario, "erroSalario", "Digite um valor maior que zero.");
    valido = false;
  } else setValido(salario);

  // Dependentes
  if (parseInt(dependentes.value) < 0 || isNaN(parseInt(dependentes.value))) {
    setErro(dependentes, "erroDependentes", "Valor inválido. Use 0 ou mais.");
    valido = false;
  } else {
    setValido(dependentes);
    calcularIR(); // força cálculo se não foi feito
  }

  return valido;
}

function calcularIR() {
  const salario = parseFloat(document.getElementById("salario").value);
  const dependentes = parseInt(document.getElementById("dependentes").value);
  const irField = document.getElementById("ir");

  if (isNaN(salario) || isNaN(dependentes)) {
    irField.value = "0,00";
    return;
  }

  let base = salario - (dependentes * 200);
  if (base < 0) base = 0;

  let aliquota = 0;
  if (base <= 1900) aliquota = 0;
  else if (base <= 2800) aliquota = 0.075;
  else if (base <= 3750) aliquota = 0.15;
  else if (base <= 4660) aliquota = 0.225;
  else aliquota = 0.275;

  let ir = base * aliquota;
  irField.value = ir.toFixed(2).replace(".", ",");
}

function setErro(campo, spanId, mensagem) {
  campo.classList.remove("is-valid");
  campo.classList.add("is-invalid");
  document.getElementById(spanId).textContent = mensagem;
}

function setValido(campo) {
  campo.classList.remove("is-invalid");
  campo.classList.add("is-valid");
}

function limparFormulario() {
  const form = document.getElementById("formCadastro");
  form.reset();

  const campos = form.querySelectorAll("input");
  campos.forEach(campo => {
    campo.classList.remove("is-valid", "is-invalid");
  });

  document.querySelectorAll(".feedback").forEach(span => {
    span.textContent = "";
  });

  document.getElementById("ir").value = "0,00";
}
