import React from 'react';
import { 
  Zap, 
  Phone, 
  MapPin, 
  Clock, 
  CreditCard, 
  Briefcase, 
  SlidersHorizontal,
  Heart
} from 'lucide-react';
import { usePriceSync } from '../context/PriceSyncContext';

export const Footer: React.FC = () => {
  const { setIsManagerOpen, resetToPhotoDefaults } = usePriceSync();

  return (
    <footer className="bg-[#0b142d] text-white pt-12 pb-8 px-4 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto">
        
        {/* Hiring banner directly from the storefront sign in the photo */}
        <div className="mb-10 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-amber-300">
          <div className="flex items-center gap-3.5">
            <div className="bg-red-600 p-3 rounded-xl text-white shadow-sm shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                Vaga de Emprego Aberta
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                CONTRATANDO: Balconista de Açougue com Experiência
              </h3>
              <p className="text-xs text-slate-800 font-medium">
                Faça parte da equipe do Supermercado Ali Raio do Sol. Entregue seu currículo no balcão ou envie pelo WhatsApp!
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/5511972428422?text=Olá!%20Tenho%20interesse%20na%20vaga%20de%20Balconista%20de%20Açougue%20com%20experiência."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#182b68] hover:bg-[#112050] text-white font-black text-xs px-5 py-3 rounded-xl shadow-md transition-all whitespace-nowrap self-stretch md:self-auto text-center"
          >
            Candidatar-se pelo WhatsApp
          </a>
        </div>

        {/* 4 Columns Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Store Logo & About */}
          <div className="space-y-3">
            <div className="bg-white px-3 py-1.5 rounded-lg border-2 border-red-600 shadow-sm inline-flex flex-col items-center justify-center">
              <div className="flex items-center font-extrabold text-[#182b68] text-xl tracking-tight leading-none">
                <span>ALI RA</span>
                <span className="text-red-600 flex items-center justify-center mx-0.5">
                  <Zap className="w-5 h-5 fill-red-600 text-red-600" />
                </span>
                <span>O DO SOL</span>
              </div>
              <span className="text-[9px] tracking-[0.3em] font-black text-slate-800 uppercase mt-0.5">
                SUPERMERCADO
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              O seu supermercado de bairro completo, com carnes frescas selecionadas, açougue tradicional, mercearia variada e preços baixos atualizados em tempo real.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsManagerOpen(true)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 underline underline-offset-4"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Acessar Painel do Gerente (Atualizar Preços)</span>
              </button>
            </div>
          </div>

          {/* Col 2: Atendimento & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-amber-400 font-black text-sm uppercase tracking-wider">
              Atendimento & Contato
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <a
                href="https://wa.me/5511972428422"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition font-bold text-sm text-white"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>(11) 97242-8422</span>
              </a>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Atendimento presencial no balcão e entregas rápidas na região</span>
              </div>

              <div className="flex items-center gap-2 pt-1 text-slate-400">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Pedidos via WhatsApp montados com 1 clique</span>
              </div>
            </div>
          </div>

          {/* Col 3: Horários de Funcionamento */}
          <div className="space-y-3">
            <h4 className="text-amber-400 font-black text-sm uppercase tracking-wider">
              Horário da Loja
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span><strong>Segunda a Sábado:</strong> 07:00 às 20:30</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span><strong>Domingos e Feriados:</strong> 07:00 às 14:00</span>
              </div>
              <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-[11px] text-slate-300 mt-2">
                🍖 Açougue funcionando em horário integral com carnes limpas e moídas na hora!
              </div>
            </div>
          </div>

          {/* Col 4: Formas de Pagamento Aceitas */}
          <div className="space-y-3">
            <h4 className="text-amber-400 font-black text-sm uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Formas de Pagamento</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="text-[11px] text-slate-400">Aceitamos no balcão e no delivery:</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-slate-800 border border-slate-700 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  Pix Instantâneo
                </span>
                <span className="bg-slate-800 border border-slate-700 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  Cartão de Débito
                </span>
                <span className="bg-slate-800 border border-slate-700 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  Cartão de Crédito
                </span>
                <span className="bg-slate-800 border border-slate-700 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  Dinheiro
                </span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Alelo / VR / VA
                </span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Ticket Alimentação
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Supermercado Ali Raio do Sol. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetToPhotoDefaults}
              className="hover:text-white underline text-[11px]"
            >
              Restaurar Preços Originais da Foto
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-[11px]">
              Atualização de preços em tempo real
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
