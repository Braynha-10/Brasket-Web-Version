import { api } from './api.js';

export class AuthManager {
    constructor(app) {
        this.app = app;
        this.user = null;
        this.isLoginMode = true;
        
        this.modal = document.getElementById('auth-modal');
        this.form = document.getElementById('auth-form');
        this.emailInput = document.getElementById('auth-email');
        this.passwordInput = document.getElementById('auth-password');
        this.title = document.getElementById('auth-title');
        this.submitBtn = document.getElementById('auth-submit');
        this.toggleBtn = document.getElementById('auth-toggle');
        this.closeBtn = document.getElementById('auth-close');
        
        this.headerBtnText = document.getElementById('header-auth-text');
        
        this.bindEvents();
        this.checkSession();
    }
    
    bindEvents() {
        if (!this.form) return;
        
        this.toggleBtn.addEventListener('click', () => {
            this.isLoginMode = !this.isLoginMode;
            this.title.innerText = this.isLoginMode ? 'Login Brassket' : 'Registrar Conta';
            this.submitBtn.innerText = this.isLoginMode ? 'Entrar' : 'Criar Conta';
            this.toggleBtn.innerText = this.isLoginMode ? 'Não tem conta? Registre-se' : 'Já tem conta? Faça login';
        });
        
        this.closeBtn.addEventListener('click', () => this.hideModal());
        
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = this.emailInput.value;
            const password = this.passwordInput.value;
            
            try {
                this.submitBtn.disabled = true;
                this.submitBtn.innerText = 'Aguarde...';
                
                let res;
                if (this.isLoginMode) {
                    res = await api.auth.login(email, password);
                } else {
                    res = await api.auth.register(email, password);
                }
                
                this.user = res.user;
                this.app.notify(`Bem-vindo, ${this.user.email.split('@')[0]}! Sincronização ativada.`);
                this.updateUI();
                this.hideModal();
                
                // Tenta puxar saves da nuvem ao logar
                this.syncDown();
                
            } catch (err) {
                alert(err.message);
            } finally {
                this.submitBtn.disabled = false;
                this.submitBtn.innerText = this.isLoginMode ? 'Entrar' : 'Criar Conta';
            }
        });
    }
    
    async checkSession() {
        try {
            const res = await api.auth.me();
            if (res.user) {
                this.user = res.user;
                this.updateUI();
                this.syncDown();
            }
        } catch (err) {
            // Não logado ou backend off
        }
    }
    
    updateUI() {
        if (!this.headerBtnText) return;
        if (this.user) {
            this.headerBtnText.innerText = this.user.email.split('@')[0];
        } else {
            this.headerBtnText.innerText = 'Login';
        }
    }
    
    showModal() {
        if (this.user) {
            if (confirm("Deseja fazer logout?")) {
                this.logout();
            }
            return;
        }
        if (this.modal) this.modal.classList.remove('hidden');
    }
    
    hideModal() {
        if (this.modal) this.modal.classList.add('hidden');
    }
    
    async logout() {
        try {
            await api.auth.logout();
        } catch(e) {}
        this.user = null;
        this.updateUI();
        this.app.notify("Você foi desconectado.");
    }
    
    // Função de sincronização com o banco (Background)
    async syncUp(league, career) {
        if (!this.user) return; // Só sincroniza se tiver logado
        try {
            // Usa o slotId = 1 por padrão para o primeiro time/save
            const slotId = 1; 
            const metadata = { teamId: career.currentTeamId, era: career.selectedEra, year: career.currentYear };
            await api.saves.save(slotId, league, career, metadata);
            console.log("💾 Save sincronizado na nuvem com sucesso!");
        } catch (err) {
            console.error("Falha ao sincronizar save na nuvem", err);
        }
    }
    
    async syncDown() {
        if (!this.user) return;
        try {
            const res = await api.saves.get(1);
            if (res.save) {
                // Se a versão na nuvem for maior que a local, seria ideal perguntar ao user
                // Por simplificação, se não houver time selecionado, carrega da nuvem
                if (!this.app.state.currentTeamId && res.save.career_data.currentTeamId) {
                    this.app.state = res.save.career_data;
                    this.app.league = res.save.league_data;
                    this.app.saveGame(); // salva local
                    this.app.render();
                    this.app.notify("☁️ Progresso restaurado da nuvem!");
                }
            }
        } catch (err) {
            console.error("Save na nuvem não encontrado ou erro:", err);
        }
    }
}
