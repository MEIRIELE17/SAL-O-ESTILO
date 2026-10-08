// ======================================================
// SISTEMA DE AGENDAMENTO DO SALÃO
// ======================================================


// ======================================================
// ELEMENTOS DA PÁGINA
// ======================================================

const formulario =
    document.getElementById("formAgendamento");

const campoData =
    document.getElementById("data");

const areaFormulario =
    document.getElementById("areaFormulario");

const areaConfirmacao =
    document.getElementById("areaConfirmacao");

const resultado =
    document.getElementById("resultado");

const btnVoltar =
    document.getElementById("btnVoltar");

const btnConfirmar =
    document.getElementById("btnConfirmar");


// ======================================================
// DATA MÍNIMA
// Impede escolher uma data passada
// ======================================================

if (campoData) {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    const dataAtual =
        `${ano}-${mes}-${dia}`;

    campoData.min = dataAtual;
}


// ======================================================
// VARIÁVEL TEMPORÁRIA
// Guarda os dados antes da confirmação
// ======================================================

let agendamentoPendente = null;


// ======================================================
// ENVIO DO FORMULÁRIO
// ======================================================

if (formulario) {

    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            validarAgendamento();

        }
    );

}


// ======================================================
// FUNÇÃO PRINCIPAL DE VALIDAÇÃO
// ======================================================

function validarAgendamento() {

    // ----------------------------------------------
    // PEGAR DADOS
    // ----------------------------------------------

    const nome =
        document
            .getElementById("nome")
            .value
            .trim();

    const profissional =
        document
            .getElementById("profissional")
            .value;

    const sexoSelecionado =
        document.querySelector(
            'input[name="sexo"]:checked'
        );

    const data =
        document
            .getElementById("data")
            .value;

    const horario =
        document
            .getElementById("horario")
            .value;


    // ----------------------------------------------
    // VALIDAR NOME
    // ----------------------------------------------

    if (nome.length < 3) {

        mostrarErro(
            "Digite um nome válido com pelo menos 3 caracteres."
        );

        return;
    }


    // ----------------------------------------------
    // VALIDAR PROFISSIONAL
    // ----------------------------------------------

    if (profissional === "") {

        mostrarErro(
            "Selecione um profissional."
        );

        return;
    }


    // ----------------------------------------------
    // VALIDAR SEXO
    // ----------------------------------------------

    if (!sexoSelecionado) {

        mostrarErro(
            "Selecione uma opção de sexo."
        );

        return;
    }


    const sexo =
        sexoSelecionado.value;


    // ----------------------------------------------
    // PEGAR SERVIÇOS
    // ----------------------------------------------

    const checkboxes =
        document.querySelectorAll(
            'input[name="servicos"]:checked'
        );


    const servicos = [];

    let total = 0;


    checkboxes.forEach(
        function (checkbox) {

            servicos.push(
                checkbox.value
            );

            total +=
                Number(
                    checkbox.dataset.preco
                );

        }
    );


    // ----------------------------------------------
    // VALIDAR SERVIÇOS
    // ----------------------------------------------

    if (servicos.length === 0) {

        mostrarErro(
            "Selecione pelo menos um serviço."
        );

        return;
    }


    // ----------------------------------------------
    // VALIDAR DATA
    // ----------------------------------------------

    if (data === "") {

        mostrarErro(
            "Selecione uma data."
        );

        return;
    }


    const dataEscolhida =
        new Date(
            `${data}T00:00:00`
        );


    const hoje =
        new Date();

    hoje.setHours(
        0,
        0,
        0,
        0
    );


    if (dataEscolhida < hoje) {

        mostrarErro(
            "Não é possível agendar para uma data passada."
        );

        return;
    }


    // ----------------------------------------------
    // VERIFICAR DOMINGO
    // ----------------------------------------------

    const diaSemana =
        dataEscolhida.getDay();


    if (diaSemana === 0) {

        mostrarErro(
            "O salão não funciona aos domingos."
        );

        return;
    }


    // ----------------------------------------------
    // VALIDAR HORÁRIO
    // ----------------------------------------------

    if (horario === "") {

        mostrarErro(
            "Selecione um horário."
        );

        return;
    }


    if (
        horario < "09:00" ||
        horario > "17:00"
    ) {

        mostrarErro(
            "O horário de atendimento é das 09:00 às 17:00."
        );

        return;
    }


    // ----------------------------------------------
    // VERIFICAR SE JÁ EXISTE ESSE AGENDAMENTO
    // ----------------------------------------------

    const agendamentoSalvo =
        JSON.parse(
            localStorage.getItem(
                "agendamento"
            )
        );


    if (agendamentoSalvo) {

        const mesmaData =
            agendamentoSalvo.data ===
            formatarData(data);

        const mesmoHorario =
            agendamentoSalvo.horario ===
            horario;


        if (
            mesmaData &&
            mesmoHorario
        ) {

            mostrarErro(
                "Esse horário já possui um agendamento. Escolha outro horário."
            );

            return;
        }

    }


    // ----------------------------------------------
    // CRIAR AGENDAMENTO TEMPORÁRIO
    // ----------------------------------------------

    agendamentoPendente = {

        nome: nome,

        profissional: profissional,

        sexo: sexo,

        servicos: servicos,

        data: formatarData(data),

        horario: horario,

        total: total

    };


    // ----------------------------------------------
    // MOSTRAR CONFIRMAÇÃO
    // ----------------------------------------------

    mostrarConfirmacao();

}


// ======================================================
// MOSTRAR TELA DE CONFIRMAÇÃO
// ======================================================

function mostrarConfirmacao() {

    document.getElementById(
        "confirmNome"
    ).textContent =
        agendamentoPendente.nome;


    document.getElementById(
        "confirmProfissional"
    ).textContent =
        agendamentoPendente.profissional;


    document.getElementById(
        "confirmSexo"
    ).textContent =
        agendamentoPendente.sexo;


    document.getElementById(
        "confirmServicos"
    ).textContent =
        agendamentoPendente.servicos.join(
            ", "
        );


    document.getElementById(
        "confirmData"
    ).textContent =
        agendamentoPendente.data;


    document.getElementById(
        "confirmHorario"
    ).textContent =
        agendamentoPendente.horario;


    document.getElementById(
        "confirmTotal"
    ).textContent =
        formatarMoeda(
            agendamentoPendente.total
        );


    // Esconder formulário

    areaFormulario.style.display =
        "none";


    // Mostrar confirmação

    areaConfirmacao.style.display =
        "block";


    // Limpar mensagem anterior

    resultado.textContent = "";

}


// ======================================================
// BOTÃO VOLTAR
// ======================================================

if (btnVoltar) {

    btnVoltar.addEventListener(
        "click",
        function () {

            areaConfirmacao.style.display =
                "none";

            areaFormulario.style.display =
                "block";

        }
    );

}


// ======================================================
// BOTÃO CONFIRMAR
// ======================================================

if (btnConfirmar) {

    btnConfirmar.addEventListener(
        "click",
        function () {

            confirmarAgendamento();

        }
    );

}


// ======================================================
// CONFIRMAR AGENDAMENTO
// ======================================================

function confirmarAgendamento() {

    if (!agendamentoPendente) {

        return;
    }


    // ----------------------------------------------
    // GERAR NÚMERO DO AGENDAMENTO
    // ----------------------------------------------

    const numero =
        "AG" +
        Date.now()
            .toString()
            .slice(-8);


    // ----------------------------------------------
    // CRIAR OBJETO FINAL
    // ----------------------------------------------

    const agendamento = {

        numero: numero,

        nome:
            agendamentoPendente.nome,

        profissional:
            agendamentoPendente.profissional,

        sexo:
            agendamentoPendente.sexo,

        servicos:
            agendamentoPendente.servicos,

        data:
            agendamentoPendente.data,

        horario:
            agendamentoPendente.horario,

        total:
            agendamentoPendente.total,

        status:
            "Confirmado"

    };


    // ----------------------------------------------
    // SALVAR NO LOCALSTORAGE
    // ----------------------------------------------

    localStorage.setItem(
        "agendamento",
        JSON.stringify(agendamento)
    );


    // ----------------------------------------------
    // SALVAR TAMBÉM OS DADOS INDIVIDUAIS
    // Mantém compatibilidade com seu código antigo
    // ----------------------------------------------

    localStorage.setItem(
        "nomeCliente",
        agendamento.nome
    );

    localStorage.setItem(
        "profissional",
        agendamento.profissional
    );

    localStorage.setItem(
        "sexoCliente",
        agendamento.sexo
    );

    localStorage.setItem(
        "listaServicos",
        agendamento.servicos.join(", ")
    );

    localStorage.setItem(
        "dataAtendimento",
        agendamento.data
    );

    localStorage.setItem(
        "horarioAtendimento",
        agendamento.horario
    );

    localStorage.setItem(
        "valorTotal",
        agendamento.total
    );


    // ----------------------------------------------
    // IR PARA O COMPROVANTE
    // ----------------------------------------------

    window.location.href =
        "comprovante.html";

}


// ======================================================
// FORMATAR DATA
// ======================================================

function formatarData(data) {

    const partes =
        data.split("-");


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


// ======================================================
// FORMATAR MOEDA
// ======================================================

function formatarMoeda(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ======================================================
// MOSTRAR ERRO
// ======================================================

function mostrarErro(mensagem) {

    resultado.textContent =
        mensagem;

    resultado.className =
        "resultado erro";

    resultado.style.display =
        "block";

}