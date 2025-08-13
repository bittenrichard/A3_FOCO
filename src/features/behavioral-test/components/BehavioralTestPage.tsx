// Local: src/features/behavioral-test/components/BehavioralTestPage.tsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ADJECTIVES_LIST } from '../utils/adjectives';
import { submitBehavioralTest } from '../services/behavioralTestApi';
import { Logo } from '@/components/Logo';
import { Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

type Step = 'positive' | 'negative' | 'submitting' | 'completed' | 'error';

const BehavioralTestPage = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [step, setStep] = useState<Step>('positive');
  const [selectedPositive, setSelectedPositive] = useState<string[]>([]);
  const [selectedNegative, setSelectedNegative] = useState<string[]>([]);

  const handleToggleAdjective = (adjective: string, listType: 'positive' | 'negative') => {
    const currentList = listType === 'positive' ? selectedPositive : selectedNegative;
    const setter = listType === 'positive' ? setSelectedPositive : setSelectedNegative;

    if (currentList.includes(adjective)) {
      setter(currentList.filter(item => item !== adjective));
    } else {
      setter([...currentList, adjective]);
    }
  };

  const handleNextStep = () => {
    if (selectedPositive.length === 0) {
        toast.error('Por favor, selecione pelo menos um adjetivo.');
        return;
    }
    setStep('negative');
  };

  const handleSubmit = async () => {
    if (!assessmentId) {
        toast.error("ID da avaliação não encontrado. O link pode estar quebrado.");
        return;
    }
    if (selectedNegative.length === 0) {
        toast.error('Por favor, selecione pelo menos um adjetivo.');
        return;
    }
    
    setStep('submitting');

    try {
      await submitBehavioralTest(parseInt(assessmentId), {
        positive: selectedPositive,
        negative: selectedNegative
      });
      setStep('completed');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro desconhecido.");
      setStep('error');
    }
  };

  const AdjectiveButton = ({ adjective, isSelected, onClick }: { adjective: string; isSelected: boolean; onClick: () => void; }) => (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md text-sm font-medium transition-colors
        ${isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }
      `}
    >
      {adjective}
    </button>
  );

  const renderContent = () => {
    switch (step) {
      case 'positive':
        return (
          <>
            <h2 className="text-xl font-semibold text-gray-800">Passo 1 de 2</h2>
            <p className="mt-2 text-gray-600">Marque abaixo os adjetivos que melhor te **representam**.</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {ADJECTIVES_LIST.map(adj => (
                <AdjectiveButton
                  key={adj}
                  adjective={adj}
                  isSelected={selectedPositive.includes(adj)}
                  onClick={() => handleToggleAdjective(adj, 'positive')}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={handleNextStep} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                Próximo passo
              </button>
            </div>
          </>
        );
      case 'negative':
        return (
          <>
            <h2 className="text-xl font-semibold text-gray-800">Passo 2 de 2</h2>
            <p className="mt-2 text-gray-600">Agora, na sua percepção, marque como **outras pessoas** pensam que você deveria ser (atributos que você tem ou não).</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {ADJECTIVES_LIST.map(adj => (
                <AdjectiveButton
                  key={adj}
                  adjective={adj}
                  isSelected={selectedNegative.includes(adj)}
                  onClick={() => handleToggleAdjective(adj, 'negative')}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-end">
                <button onClick={() => setStep('positive')} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors mr-4">
                  Voltar
                </button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                  Finalizar
                </button>
            </div>
          </>
        );
      case 'submitting':
        return (
          <div className="text-center py-20">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Enviando suas respostas...</h2>
            <p className="mt-2 text-gray-600">Aguarde um momento enquanto processamos seu teste.</p>
          </div>
        );
      case 'completed':
        return (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Obrigado!</h2>
            <p className="mt-2 text-gray-600">Suas respostas foram enviadas com sucesso para o recrutador. Boa sorte no processo seletivo!</p>
            <p className="mt-1 text-sm text-gray-500">Você já pode fechar esta janela.</p>
          </div>
        );
       case 'error':
        return (
          <div className="text-center py-20">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Ocorreu um Erro</h2>
            <p className="mt-2 text-gray-600">Não foi possível enviar suas respostas. Por favor, tente novamente mais tarde ou contate o recrutador.</p>
            <button onClick={() => setStep('negative')} className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                Tentar Novamente
            </button>
          </div>
        );
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="p-4 border-b bg-white">
          <Logo />
        </header>
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
                {renderContent()}
            </div>
        </main>
        <footer className="text-center p-4 text-sm text-gray-500">
            Recruta.AI &copy; {new Date().getFullYear()} - Todos os direitos reservados.
        </footer>
      </div>
    </>
  );
};

export default BehavioralTestPage;