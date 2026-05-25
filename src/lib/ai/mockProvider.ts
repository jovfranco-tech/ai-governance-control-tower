import { AIEngineProvider, AIGovernanceResponse } from './provider';

export class MockAIEngineProvider implements AIEngineProvider {
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
    const isEs = useCaseData.lang === 'es';
    let riskLevel: AIGovernanceResponse['risk_level'] = 'Medium';
    let recommendedControls = ['CTL-001', 'CTL-004', 'CTL-011'];
    let confidence = 0.85;

    const sens = useCaseData.dataSensitivity.toLowerCase();
    const title = useCaseData.title.toLowerCase();

    if (sens.includes('confidential') || sens.includes('secret') || sens.includes('sensible') || sens.includes('confidencial')) {
      riskLevel = 'High';
      recommendedControls = ['CTL-001', 'CTL-004', 'CTL-007', 'CTL-012', 'CTL-013'];
      confidence = 0.92;
    }

    if (sens.includes('highly') || title.includes('resume') || title.includes('contract') || title.includes('hr') || title.includes('contrato') || title.includes('personal')) {
      riskLevel = 'Critical';
      recommendedControls = ['CTL-001', 'CTL-004', 'CTL-007', 'CTL-012', 'CTL-013', 'CTL-020'];
      confidence = 0.95;
    }

    const rationale = isEs
      ? `Evaluación GRC de IA para la iniciativa "${useCaseData.title}" bajo la unidad de negocio "${useCaseData.businessUnit}". El uso de un modelo tipo "${useCaseData.modelType}" con datos clasificados como "${useCaseData.dataSensitivity}" presenta riesgos de cumplimiento en privacidad y control organizativo. Se requiere validación de auditoría antes del despliegue.`
      : `AI GRC assessment of initiative "${useCaseData.title}" under ${useCaseData.businessUnit}. The use of model type "${useCaseData.modelType}" processing data classified as "${useCaseData.dataSensitivity}" presents risks regarding compliance alignment. Human oversight is highly recommended before deploying.`;

    const limitations = isEs
      ? 'Modelo de evaluación simulado para demostración. No reemplaza auditorías formales de CISO ni asesoramiento legal vinculante.'
      : 'Simulated assessment model for demo. This does not replace formal legal counsel or CISO validation audits.';

    const nextActions = isEs
      ? [
          'Realizar auditoría de sesgo en los puntos de control del modelo.',
          'Establecer parámetros de retención de logs de conformidad con la ISO/IEC 42001.',
          'Registrar aprobación formal del comité de ética.'
        ]
      : [
          'Conduct a bias audit on model training checkpoints.',
          'Submit log retention parameters for regulatory compliance review.',
          'Log formal steering committee human approval vote.'
        ];

    return {
      task_type: 'risk_assessment',
      organization_id: useCaseData.organizationId,
      use_case_id: useCaseData.useCaseId,
      risk_level: riskLevel,
      confidence,
      rationale,
      recommended_controls: recommendedControls,
      limitations,
      human_review_required: true,
      next_actions: nextActions,
      language: useCaseData.lang,
      generated_at: new Date().toISOString()
    };
  }

  public async generateControlRecommendations(useCaseData: {
    organizationId: string;
    useCaseId: string | null;
    title: string;
    description: string;
    riskLevel: string;
    lang: 'en' | 'es';
  }): Promise<AIGovernanceResponse> {
    const isEs = useCaseData.lang === 'es';
    let controls = ['CTL-001', 'CTL-004', 'CTL-011'];
    const risk = useCaseData.riskLevel;

    if (risk === 'Critical' || risk === 'Crítico') {
      controls = ['CTL-001', 'CTL-004', 'CTL-007', 'CTL-012', 'CTL-013', 'CTL-020'];
    } else if (risk === 'High' || risk === 'Alto') {
      controls = ['CTL-001', 'CTL-004', 'CTL-007', 'CTL-012', 'CTL-013'];
    }

    const rationale = isEs
      ? `Se recomiendan controles basados en el nivel de riesgo "${risk}" de la iniciativa "${useCaseData.title}". Se priorizan controles de transparencia y auditorías algorítmicas robustas.`
      : `Recommended controls mapped to risk level "${risk}" of initiative "${useCaseData.title}". Transparency and algorithmic audit trails have been prioritized.`;

    const limitations = isEs
      ? 'Las recomendaciones se basan en un mapeo conceptual estándar de la norma ISO/IEC 42001.'
      : 'Recommendations are based on standard conceptual mappings of ISO/IEC 42001.';

    return {
      task_type: 'control_recommendation',
      organization_id: useCaseData.organizationId,
      use_case_id: useCaseData.useCaseId,
      risk_level: (risk.includes('Crit') || risk.includes('Crit')) ? 'Critical' : (risk.includes('Alt') || risk.includes('High') ? 'High' : 'Medium'),
      confidence: 0.90,
      rationale,
      recommended_controls: controls,
      limitations,
      human_review_required: false,
      next_actions: isEs 
        ? ['Asignar propietarios a cada control de seguridad recomendado.', 'Vincular evidencias válidas en el panel.']
        : ['Assign owners to each recommended safety control.', 'Link valid compliance evidence in the dashboard.'],
      language: useCaseData.lang,
      generated_at: new Date().toISOString()
    };
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
    const isEs = useCaseData.lang === 'es';

    const summary = isEs
      ? `El portafolio corporativo comprende actualmente ${useCaseData.totalUseCases} iniciativas registradas (${useCaseData.activeUseCases} operativas). Identificamos ${useCaseData.totalRisks} riesgos abiertos, con ${useCaseData.criticalOpenRisks} exposiciones Críticas/Altas que demandan atención. Persisten ${useCaseData.missingEvidence} brechas de evidencia y ${useCaseData.overdueControls} controles vencidos.`
      : `The corporate AI portfolio currently comprises ${useCaseData.totalUseCases} registered initiatives (${useCaseData.activeUseCases} operational). We identify ${useCaseData.totalRisks} open risks, with ${useCaseData.criticalOpenRisks} Critical/High exposures requiring steering committee attention. There are ${useCaseData.missingEvidence} evidence gaps and ${useCaseData.overdueControls} overdue controls.`;

    const rationale = isEs
      ? 'Resumen ejecutivo consolidado de la postura de gobernanza corporativa para la junta directiva.'
      : 'Consolidated executive summary of corporate governance posture prepared for board-level reporting.';

    const decisionPoints = isEs
      ? [
          'Aprobación del presupuesto de mitigación para controles Críticos vencidos.',
          'Autorización del marco de auditorías externas ISO 42001.'
        ]
      : [
          'Mitigation budget approval for overdue Critical controls.',
          'Authorization of external ISO 42001 audit frameworks.'
        ];

    const nextActions = isEs
      ? ['Presentar este informe en la sesión directiva de Q2.', 'Iniciar planes de remediación para controles vencidos.']
      : ['Present this brief in the Q2 executive session.', 'Initiate remediation pathways for overdue controls.'];

    return {
      task_type: 'executive_brief',
      organization_id: useCaseData.organizationId,
      use_case_id: useCaseData.useCaseId,
      risk_level: useCaseData.criticalOpenRisks > 0 ? 'High' : 'Medium',
      confidence: 0.94,
      rationale,
      recommended_controls: ['CTL-001', 'CTL-012'],
      limitations: isEs 
        ? 'Resumen ejecutivo agregador basado exclusivamente en los metadatos cargados.' 
        : 'Aggregated brief based exclusively on active system metadata parameters.',
      human_review_required: true,
      next_actions: nextActions,
      language: useCaseData.lang,
      generated_at: new Date().toISOString(),

      executive_summary: summary,
      decision_points: decisionPoints,
      risk_position: isEs 
        ? `Exposición de riesgo activa concentrada principalmente en ${useCaseData.criticalOpenRisks} vectores críticos.` 
        : `Active risk exposure concentrated heavily within ${useCaseData.criticalOpenRisks} critical vectors.`,
      business_value: isEs
        ? 'Alineación reguladora lograda en un 78%, protegiendo ingresos proyectados y mitigando multas de cumplimiento.'
        : 'Regulatory alignment achieved at 78%, safeguarding projected revenue and mitigating compliance penalties.',
      required_actions: isEs
        ? ['Asignar recursos urgentes al cierre de brechas de evidencia.', 'Actualizar políticas de retención.']
        : ['Assign urgent resources to close outstanding evidence gaps.', 'Update regulatory retention policies.'],
      board_level_note: isEs
        ? 'El cumplimiento continuo de la gobernanza de IA reduce el riesgo operacional en un 24% interanual.'
        : 'Continuous compliance in AI governance reduces operational risk exposure by 24% year-over-year.'
    };
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
    const isEs = useCaseData.lang === 'es';

    const gaps = isEs
      ? [
          'Falta de registro explícito de auditoría algorítmica para la iniciativa.',
          'Ausencia de trazabilidad del control humano en el ciclo (Human-in-the-loop).'
        ]
      : [
          'Lack of explicit algorithmic audit logging for the target initiative.',
          'Absence of human-in-the-loop control traceability workflows.'
        ];

    const missingControls = ['CTL-012', 'CTL-013'];

    const rationale = isEs
      ? `El análisis del caso de uso "${useCaseData.title}" revela brechas normativas con respecto a la directiva de Gobernanza. Con ${useCaseData.controlsTally} controles activos y ${useCaseData.evidenceTally} evidencias cargadas, se identifica vulnerabilidad en transparencia.`
      : `Analysis of initiative "${useCaseData.title}" reveals structural policy gaps relative to corporate directives. With ${useCaseData.controlsTally} active controls and ${useCaseData.evidenceTally} submitted proofs, transparency vulnerabilities are present.`;

    return {
      task_type: 'policy_gap_analysis',
      organization_id: useCaseData.organizationId,
      use_case_id: useCaseData.useCaseId,
      risk_level: useCaseData.evidenceTally === 0 ? 'High' : 'Medium',
      confidence: 0.88,
      rationale,
      recommended_controls: missingControls,
      limitations: isEs
        ? 'El análisis se limita a evaluar la presencia formal de evidencias cargadas frente a los requisitos.'
        : 'Analysis is limited to formal evidence existence matching against framework checklists.',
      human_review_required: true,
      next_actions: isEs
        ? ['Subir evidencias requeridas para controles CTL-012.', 'Programar revisión con el oficial de cumplimiento.']
        : ['Upload outstanding evidence for CTL-012.', 'Schedule compliance review with the legal officer.'],
      language: useCaseData.lang,
      generated_at: new Date().toISOString(),

      detected_gaps: gaps,
      missing_controls: missingControls,
      policy_risks: isEs
        ? ['Sanción potencial bajo el artículo 14 del Reglamento de IA de la UE.', 'Riesgo reputacional alto.']
        : ['Potential fine under Article 14 of the EU AI Act.', 'High reputational exposure due to audit gaps.'],
      recommended_remediation: isEs
        ? 'Implementar un plan de remediación rápida agregando registros de trazabilidad y asignando aprobadores humanos.'
        : 'Implement a rapid remediation pathway by deploying automated logging and assigning human signoffs.'
    };
  }
}
