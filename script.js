// Dados simulados para o aplicativo
const EscolaDeBolso = {
    // Inicializar dados no localStorage se não existirem
    init: function() {
        if (!localStorage.getItem('escolaDeBolsoData')) {
            const initialData = {
                alunos: [
                    { id: 1, nome: "Rebeca Silva", turma: "2º ano do ensino médio", humor: "tedio", presenca: [true, true, true, false, true] },
                    { id: 2, nome: "Carlos Mendes", turma: "3º ano do ensino médio", humor: "alegria", presenca: [true, true, true, true, true] },
                    { id: 3, nome: "Ana Paula Costa", turma: "1º ano do ensino médio", humor: "tristeza", presenca: [true, false, true, true, false] },
                    { id: 4, nome: "João Pedro Almeida", turma: "2º ano do ensino médio", humor: "focado", presenca: [true, true, false, true, true] },
                    { id: 5, nome: "Maria Eduarda Lima", turma: "3º ano do ensino médio", humor: "empolgado", presenca: [true, true, true, true, true] }
                ],
                mensagens: [
                    { id: 1, alunoId: 1, alunoNome: "Rebeca Silva", conteudo: "Estou com dificuldade em matemática, poderia me ajudar?", data: "23/01/2025", lida: false },
                    { id: 2, alunoId: 3, alunoNome: "Ana Paula Costa", conteudo: "Não estou me sentindo bem esta semana.", data: "22/10/2025", lida: true },
                    { id: 3, alunoId: 2, alunoNome: "Carlos Mendes", conteudo: "A aula de hoje foi excelente!", data: "20/10/2025", lida: true }
                ],
                comunicados: [
                    { id: 1, titulo: "Reunião de pais e mestres", conteudo: "Convite para reunião mensal de pais e mestres que ocorrerá no dia 30/10 às 19h no auditório da escola.", data: "24/10/2025" },
                    { id: 2, titulo: "Feriado escolar", conteudo: "Informamos que não haverá aula no dia 15/11 devido ao feriado nacional. As aulas serão retomadas normalmente no dia 16/11.", data: "20/10/2025" },
                    { id: 3, titulo: "Campanha do agasalho", conteudo: "Estamos arrecadando agasalhos para doação. As doações podem ser entregues na secretaria da escola até o dia 30/10.", data: "15/10/2025" }
                ],
                humorAluno: { estado: "tedio", data: "25/10/2025", mensagem: "Estou me sentindo entediado esta semana." }
            };
            
            localStorage.setItem('escolaDeBolsoData', JSON.stringify(initialData));
        }
        
        this.carregarDados();
        this.inicializarPagina();
    },
    
    // Carregar dados do localStorage
    carregarDados: function() {
        const data = localStorage.getItem('escolaDeBolsoData');
        if (data) {
            this.dados = JSON.parse(data);
        }
    },
    
    // Salvar dados no localStorage
    salvarDados: function() {
        localStorage.setItem('escolaDeBolsoData', JSON.stringify(this.dados));
    },
    
    // Inicializar a página atual
    inicializarPagina: function() {
        const pagina = window.location.pathname.split('/').pop();
        
        switch(pagina) {
            case 'aluno.html':
                this.inicializarPaginaAluno();
                break;
            case 'responsavel.html':
                this.inicializarPaginaResponsavel();
                break;
            case 'instituicao.html':
                this.inicializarPaginaInstituicao();
                break;
            case 'index.html':
            default:
                // Nada a fazer na página inicial
                break;
        }
    },
    
    // Página do aluno
    inicializarPaginaAluno: function() {
        // Configurar opções de humor
        const opcoesHumor = document.querySelectorAll('.mood-option');
        opcoesHumor.forEach(opcao => {
            opcao.addEventListener('click', () => {
                const humor = opcao.getAttribute('data-mood');
                this.definirHumorAluno(humor);
            });
        });
        
        // Configurar botão de salvar humor
        const btnSalvarHumor = document.getElementById('saveMoodBtn');
        if (btnSalvarHumor) {
            btnSalvarHumor.addEventListener('click', () => {
                this.salvarHumorAluno();
            });
        }
        
        // Configurar botão de enviar mensagem
        const btnEnviarMensagem = document.getElementById('sendMessageBtn');
        if (btnEnviarMensagem) {
            btnEnviarMensagem.addEventListener('click', () => {
                this.enviarMensagemAluno();
            });
        }
        
        // Carregar humor atual
        this.carregarHumorAluno();
        
        // Carregar mensagens do aluno
        this.carregarMensagensAluno();
        
        // Aplicar seleção visual inicial
        this.aplicarSelecaoHumorInicial();
    },
    
    // Página do responsável
    inicializarPaginaResponsavel: function() {
        // Carregar humor do aluno
        this.carregarHumorAlunoResponsavel();
    },
    
    // Página da instituição
    inicializarPaginaInstituicao: function() {
        // Configurar botão de enviar comunicado
        const btnEnviarComunicado = document.getElementById('sendAnnouncementBtn');
        if (btnEnviarComunicado) {
            btnEnviarComunicado.addEventListener('click', () => {
                this.enviarComunicado();
            });
        }
        
        // Configurar filtros de mensagens
        const botoesFiltro = document.querySelectorAll('.btn-filter');
        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', () => {
                // Remover classe active de todos os botões
                botoesFiltro.forEach(b => b.classList.remove('active'));
                // Adicionar classe active ao botão clicado
                botao.classList.add('active');
                
                // Filtrar mensagens
                const filtro = botao.getAttribute('data-filter');
                this.filtrarMensagens(filtro);
            });
        });
        
        // Carregar mensagens recebidas
        this.carregarMensagensInstituicao();
        
        // Carregar comunicados
        this.carregarComunicadosInstituicao();
    },
    
    // Aplicar seleção visual inicial do humor
    aplicarSelecaoHumorInicial: function() {
        const humorAluno = this.dados.humorAluno;
        if (humorAluno && humorAluno.estado) {
            const opcoesHumor = document.querySelectorAll('.mood-option');
            opcoesHumor.forEach(opcao => {
                if (opcao.getAttribute('data-mood') === humorAluno.estado) {
                    opcao.classList.add('selected');
                }
            });
            
            // Atualizar display
            const displayHumor = document.getElementById('currentMood');
            if (displayHumor) {
                displayHumor.textContent = this.formatarHumor(humorAluno.estado);
            }
            
            // Definir humor temporário
            this.humorTemporario = humorAluno.estado;
        }
    },
    
    // Definir humor do aluno
    definirHumorAluno: function(humor) {
        // Remover seleção de todas as opções
        const opcoesHumor = document.querySelectorAll('.mood-option');
        opcoesHumor.forEach(opcao => {
            opcao.classList.remove('selected');
        });
        
        // Adicionar seleção à opção clicada
        opcoesHumor.forEach(opcao => {
            if (opcao.getAttribute('data-mood') === humor) {
                opcao.classList.add('selected');
            }
        });
        
        // Atualizar display
        const displayHumor = document.getElementById('currentMood');
        if (displayHumor) {
            displayHumor.textContent = this.formatarHumor(humor);
        }
        
        // Salvar temporariamente no objeto
        this.humorTemporario = humor;
    },
    
    // Salvar humor do aluno
    salvarHumorAluno: function() {
        if (!this.humorTemporario) {
            alert('Por favor, selecione um humor antes de salvar.');
            return;
        }
        
        // Atualizar dados
        this.dados.humorAluno = {
            estado: this.humorTemporario,
            data: this.formatarData(new Date()),
            mensagem: this.gerarMensagemHumor(this.humorTemporario)
        };
        
        // Atualizar também no array de alunos
        const alunoIndex = this.dados.alunos.findIndex(aluno => aluno.id === 1);
        if (alunoIndex !== -1) {
            this.dados.alunos[alunoIndex].humor = this.humorTemporario;
        }
        
        // Salvar no localStorage
        this.salvarDados();
        
        // Atualizar interface
        this.carregarHumorAluno();
        
        // Mostrar confirmação
        alert('Seu humor foi salvo com sucesso!');
    },
    
    // Carregar humor do aluno na página do aluno
    carregarHumorAluno: function() {
        const humorAluno = this.dados.humorAluno;
        const displayHumor = document.getElementById('currentMood');
        
        if (displayHumor && humorAluno) {
            displayHumor.textContent = this.formatarHumor(humorAluno.estado);
        }
    },
    
    // Carregar humor do aluno na página do responsável
    carregarHumorAlunoResponsavel: function() {
        const humorAluno = this.dados.humorAluno;
        
        if (humorAluno) {
            const iconeHumor = document.getElementById('studentMoodIcon');
            const textoHumor = document.getElementById('studentMoodText');
            const dataHumor = document.getElementById('studentMoodDate');
            const mensagemHumor = document.getElementById('studentMoodMessage');
            
            if (iconeHumor) {
                iconeHumor.className = 'mood-icon-large';
                
                // Definir classe baseada no humor
                if (humorAluno.estado === 'alegria' || humorAluno.estado === 'empolgado') {
                    iconeHumor.classList.add('happy');
                } else if (humorAluno.estado === 'tristeza' || humorAluno.estado === 'raiva' || humorAluno.estado === 'tedio') {
                    iconeHumor.classList.add('sad');
                } else {
                    iconeHumor.classList.add('neutral');
                }
                
                // Definir ícone apropriado
                let icone;
                switch(humorAluno.estado) {
                    case 'alegria': icone = 'fa-laugh-beam'; break;
                    case 'empolgado': icone = 'fa-grin-stars'; break;
                    case 'focado': icone = 'fa-user-check'; break;
                    case 'tedio': icone = 'fa-meh-blank'; break;
                    case 'tristeza': icone = 'fa-frown'; break;
                    case 'raiva': icone = 'fa-angry'; break;
                    default: icone = 'fa-meh';
                }
                
                iconeHumor.innerHTML = `<i class="fas ${icone}"></i>`;
            }
            
            if (textoHumor) textoHumor.textContent = this.formatarHumor(humorAluno.estado);
            if (dataHumor) dataHumor.textContent = `Registrado em: ${humorAluno.data}`;
            if (mensagemHumor) mensagemHumor.textContent = `"${humorAluno.mensagem}"`;
        }
    },
    
    // Enviar mensagem do aluno
    enviarMensagemAluno: function() {
        const textoMensagem = document.getElementById('messageText').value.trim();
        
        if (!textoMensagem) {
            alert('Por favor, digite uma mensagem antes de enviar.');
            return;
        }
        
        // Criar nova mensagem
        const novaMensagem = {
            id: this.dados.mensagens.length + 1,
            alunoId: 1, // ID do aluno Rebeca (simulado)
            alunoNome: "Rebeca Silva",
            conteudo: textoMensagem,
            data: this.formatarData(new Date()),
            lida: false
        };
        
        // Adicionar aos dados
        this.dados.mensagens.unshift(novaMensagem);
        
        // Salvar no localStorage
        this.salvarDados();
        
        // Limpar campo de texto
        document.getElementById('messageText').value = '';
        
        // Atualizar lista de mensagens
        this.carregarMensagensAluno();
        
        // Mostrar confirmação
        alert('Mensagem enviada com sucesso!');
    },
    
    // Carregar mensagens do aluno
    carregarMensagensAluno: function() {
        const listaMensagens = document.getElementById('messageList');
        if (!listaMensagens) return;
        
        // Filtrar mensagens do aluno (ID 1 = Rebeca Silva)
        const mensagensAluno = this.dados.mensagens.filter(msg => msg.alunoId === 1);
        
        if (mensagensAluno.length === 0) {
            listaMensagens.innerHTML = '<p class="no-messages">Nenhuma mensagem enviada ainda.</p>';
            return;
        }
        
        // Gerar HTML das mensagens
        let html = '';
        mensagensAluno.forEach(mensagem => {
            html += `
                <div class="message-item">
                    <div class="message-header">
                        <strong>Enviado em: ${mensagem.data}</strong>
                    </div>
                    <div class="message-content">
                        ${mensagem.conteudo}
                    </div>
                </div>
            `;
        });
        
        listaMensagens.innerHTML = html;
    },
    
    // Carregar mensagens na página da instituição
    carregarMensagensInstituicao: function() {
        const listaMensagens = document.getElementById('inboxList');
        if (!listaMensagens) return;
        
        if (this.dados.mensagens.length === 0) {
            return; // Manter a mensagem padrão de caixa vazia
        }
        
        // Gerar HTML das mensagens
        let html = '';
        this.dados.mensagens.forEach(mensagem => {
            const classeLida = mensagem.lida ? '' : 'unread';
            html += `
                <div class="inbox-item ${classeLida}">
                    <div class="message-header">
                        <strong>${mensagem.alunoNome}</strong>
                        <span class="message-date">${mensagem.data}</span>
                    </div>
                    <div class="message-content">
                        ${mensagem.conteudo}
                    </div>
                </div>
            `;
        });
        
        listaMensagens.innerHTML = html;
    },
    
    // Filtrar mensagens na página da instituição
    filtrarMensagens: function(filtro) {
        const itensMensagem = document.querySelectorAll('.inbox-item');
        
        itensMensagem.forEach(item => {
            switch(filtro) {
                case 'unread':
                    item.style.display = item.classList.contains('unread') ? 'block' : 'none';
                    break;
                case 'read':
                    item.style.display = !item.classList.contains('unread') ? 'block' : 'none';
                    break;
                default: // 'all'
                    item.style.display = 'block';
                    break;
            }
        });
    },
    
    // Enviar comunicado da instituição
    enviarComunicado: function() {
        const titulo = document.getElementById('announcementTitle').value.trim();
        const conteudo = document.getElementById('announcementMessage').value.trim();
        
        if (!titulo || !conteudo) {
            alert('Por favor, preencha todos os campos antes de enviar.');
            return;
        }
        
        // Criar novo comunicado
        const novoComunicado = {
            id: this.dados.comunicados.length + 1,
            titulo: titulo,
            conteudo: conteudo,
            data: this.formatarData(new Date())
        };
        
        // Adicionar aos dados
        this.dados.comunicados.unshift(novoComunicado);
        
        // Salvar no localStorage
        this.salvarDados();
        
        // Limpar campos
        document.getElementById('announcementTitle').value = '';
        document.getElementById('announcementMessage').value = '';
        
        // Atualizar lista de comunicados
        this.carregarComunicadosInstituicao();
        
        // Mostrar confirmação
        alert('Comunicado enviado com sucesso!');
    },
    
    // Carregar comunicados na página da instituição
    carregarComunicadosInstituicao: function() {
        const listaComunicados = document.getElementById('announcementList');
        if (!listaComunicados) return;
        
        if (this.dados.comunicados.length === 0) {
            listaComunicados.innerHTML = '<p>Nenhum comunicado enviado ainda.</p>';
            return;
        }
        
        // Gerar HTML dos comunicados (após os 3 primeiros)
        let html = '';
        this.dados.comunicados.slice(3).forEach(comunicado => {
            html += `
                <div class="announcement">
                    <div class="announcement-header">
                        <h4>${comunicado.titulo}</h4>
                        <span class="announcement-date">${comunicado.data}</span>
                    </div>
                    <p>${comunicado.conteudo}</p>
                </div>
            `;
        });
        
        listaComunicados.innerHTML = html;
    },
    
    // Funções auxiliares
    formatarHumor: function(humor) {
        const formatos = {
            'alegria': 'Alegria 😊',
            'empolgado': 'Empolgado 🤩',
            'focado': 'Focado 🎯',
            'tedio': 'Tédio 😑',
            'tristeza': 'Tristeza 😔',
            'raiva': 'Raiva 😠'
        };
        return formatos[humor] || humor;
    },
    
    formatarData: function(data) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    },
    
    gerarMensagemHumor: function(humor) {
        const mensagens = {
            'alegria': 'Estou me sentindo muito feliz e animado!',
            'empolgado': 'Estou empolgado com as atividades da escola!',
            'focado': 'Estou focado e determinado nos meus estudos.',
            'tedio': 'Estou me sentindo entediado com as aulas.',
            'tristeza': 'Estou me sentindo triste e desanimado.',
            'raiva': 'Estou me sentindo irritado e com raiva.'
        };
        return mensagens[humor] || 'Registro de humor salvo.';
    }
};

// Inicializar a aplicação quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    EscolaDeBolso.init();
});