// Local: src/features/behavioral-test/services/behavioralTestApi.ts

import { AnswerSet } from "../types/AnswerSet";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Inicia um novo teste comportamental para um candidato.
 * @param candidateId - O ID do candidato.
 * @param recruiterId - O ID do recrutador que está solicitando o teste.
 * @returns O ID da nova avaliação (assessmentId).
 */
export const startBehavioralTest = async (candidateId: number, recruiterId: number): Promise<{ assessmentId: number }> => {
  const response = await fetch(`${API_BASE_URL}/behavioral-test/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ candidateId, recruiterId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Falha ao iniciar o teste comportamental.');
  }

  const data = await response.json();
  return data;
};

/**
 * Envia as respostas do teste para análise da IA.
 * @param assessmentId - O ID da avaliação que está sendo submetida.
 * @param answers - O conjunto de respostas (adjetivos selecionados).
 */
export const submitBehavioralTest = async (assessmentId: number, answers: AnswerSet) => {
  const response = await fetch(`${API_BASE_URL}/behavioral-test/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assessmentId, answers }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Falha ao enviar as respostas do teste.');
  }

  return response.json();
};

/**
 * Busca o resultado de uma avaliação comportamental concluída.
 * @param assessmentId - O ID da avaliação.
 * @returns Os dados completos do resultado da avaliação.
 */
export const getBehavioralTestResult = async (assessmentId: number) => {
  const response = await fetch(`${API_BASE_URL}/behavioral-test/result/${assessmentId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Falha ao buscar o resultado do teste.');
  }

  const result = await response.json();
  return result.data;
};