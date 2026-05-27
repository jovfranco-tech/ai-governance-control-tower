import { AIEngineProvider, AIGovernanceResponse } from './provider';
import { MockAIEngineProvider } from './mockProvider';
import { supabase, isSupabaseConfigured } from '../supabase/client';

export class LiveAIEngineProvider implements AIEngineProvider {
  private mockFallback = new MockAIEngineProvider();

  private async getAuthHeaders(): Promise<HeadersInit> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  public async generateRiskAssessment(useCaseData: {
    organizationId: string;
    useCaseId: string | null;
    title: string;
    description: string;
    dataSensitivity: string;
    modelType: string;
    businessUnit: string;
    lang: 'en' | 'es';
  }): Promise<AIGovernanceResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch('/api/ai/assess', {
        method: 'POST',
        headers,
        body: JSON.stringify(useCaseData),
      });

      if (!response.ok) {
        throw new Error(`API returned error status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.warn('Failed to query secure serverless AI Risk endpoint. Cascading to mock fallback.', error);
      const res = await this.mockFallback.generateRiskAssessment(useCaseData);
      res.is_simulated = true;
      res.ai_mode_status = 'client_fallback';
      return res;
    }
  }

  public async generateControlRecommendations(useCaseData: {
    organizationId: string;
    useCaseId: string | null;
    title: string;
    description: string;
    riskLevel: string;
    lang: 'en' | 'es';
  }): Promise<AIGovernanceResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch('/api/ai/controls', {
        method: 'POST',
        headers,
        body: JSON.stringify(useCaseData),
      });

      if (!response.ok) {
        throw new Error(`API returned error status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.warn('Failed to query secure serverless Controls endpoint. Cascading to mock.', error);
      const res = await this.mockFallback.generateControlRecommendations(useCaseData);
      res.is_simulated = true;
      res.ai_mode_status = 'client_fallback';
      return res;
    }
  }

  public async generateExecutiveBrief(useCaseData: {
    organizationId: string;
    useCaseId: string | null;
    totalUseCases: number;
    activeUseCases: number;
    totalRisks: number;
    criticalOpenRisks: number;
    missingEvidence: number;
    overdueControls: number;
    lang: 'en' | 'es';
  }): Promise<AIGovernanceResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch('/api/ai/brief', {
        method: 'POST',
        headers,
        body: JSON.stringify(useCaseData),
      });

      if (!response.ok) {
        throw new Error(`API returned error status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.warn('Failed to query secure serverless Executive Brief endpoint. Cascading to mock.', error);
      const res = await this.mockFallback.generateExecutiveBrief(useCaseData);
      res.is_simulated = true;
      res.ai_mode_status = 'client_fallback';
      return res;
    }
  }

  public async generatePolicyGapAnalysis(useCaseData: {
    organizationId: string;
    useCaseId: string | null;
    title: string;
    description: string;
    controlsTally: number;
    evidenceTally: number;
    lang: 'en' | 'es';
  }): Promise<AIGovernanceResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch('/api/ai/policy-gap', {
        method: 'POST',
        headers,
        body: JSON.stringify(useCaseData),
      });

      if (!response.ok) {
        throw new Error(`API returned error status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.warn('Failed to query secure serverless Policy Gap endpoint. Cascading to mock.', error);
      const res = await this.mockFallback.generatePolicyGapAnalysis(useCaseData);
      res.is_simulated = true;
      res.ai_mode_status = 'client_fallback';
      return res;
    }
  }
}
