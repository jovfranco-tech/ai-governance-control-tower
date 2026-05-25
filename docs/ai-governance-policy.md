# AI Governance Policy and GRC Framework

This document outlines the system alignment with global AI management standards (ISO/IEC 42001, NIST AI RMF, and the EU AI Act), outlining prompt structures, system constraints, and human-in-the-loop validation checkpoints.

---

## 1. Compliance Alignment Matrix

The Control Tower is architected to operationalize key sections of modern Artificial Intelligence Management Systems (AIMS):

| Standard Section | Policy Constraint | Control Tower Operationalization |
| :--- | :--- | :--- |
| **ISO/IEC 42001 Annex A.3** | AI System Life Cycle | Enforces status gates: Use cases cannot transition to "In Production" without completing baseline risk evaluations. |
| **ISO/IEC 42001 Annex A.4** | Human Oversight | Dynamic Required Decisions log. Critical path blockers (like bias reports) require a formal executive vote and signature. |
| **NIST AI RMF (Map 1.1)** | Context & Risk Characterization | Multi-vector scoring engine evaluating Data Sensitivity, Autonomy, User Impact, and Regulatory Exposure. |
| **EU AI Act Art. 9** | Risk Management System | Dynamic recommendations recommending highly tailored controls based on risk parameters. |

---

## 2. Prompt Safety & Structured Completion Controls

To ensure absolute safety and compliance in AI-generated technical justifications:
1. **Zero Raw Completion Interfaces:** The application never exposes open text area inputs for direct LLM processing, preventing prompt injection attacks.
2. **Aggregated Input Models:** LLM requests carry only high-level, anonymized portfolio count matrices, ensuring PII is never transmitted to models.
3. **Structured Schemas:** Completion outputs are strictly validated against JSON schemas, enforcing structured and deterministic responses.
4. **Decoupled Fallback:** The client gracefully falls back to a fast, local, deterministic simulation template if API credentials are not found, preventing platform lockouts or high billing costs.

---

## 3. Human-in-the-Loop Validation Checkpoint

A core GRC guideline is that AI should **recommend** and **explain**, but never **approve** or **execute** autonomously.
* **Advisory Status:** All technical risk scoring justifications and policy exception recommendations are labeled clearly as *"AI-Generated Advisor Outputs"*.
* **Executive Decision Logging:** Status transitions and mitigation reviews require an authenticated human Decision Owner to select their persona profile, supply a formal business reason, and log review timestamps, guaranteeing full executive traceability.
