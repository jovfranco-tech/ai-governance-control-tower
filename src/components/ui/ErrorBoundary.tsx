import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL GRC CLIENT EXCEPTION:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isEn = window.location.pathname.includes('/en') || !navigator.language.startsWith('es');

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
          {/* Subtle tech background grids */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 to-slate-950 opacity-40"></div>
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <ShieldAlert className="w-80 height-80 text-indigo-500" />
          </div>

          <div className="relative z-10 w-full max-w-lg bg-slate-900/80 backdrop-blur-md rounded-2xl border border-red-500/20 p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 bg-red-950/40 rounded-full flex items-center justify-center border border-red-500/30">
              <AlertOctagon className="w-8 h-8 text-red-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-red-500/20">
                SecOps Alert
              </span>
              <h2 className="text-xl font-black text-slate-100 tracking-tight mt-1">
                {isEn ? 'GRC Interface Interrupted' : 'Interfaz de GRC Interrumpida'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed text-justify px-2">
                {isEn 
                  ? 'A critical client runtime exception was captured. The platform has intercepted the error to protect tenant data boundaries. Stack traces have been masked in accordance with DevSecOps guidelines.'
                  : 'Se capturó una excepción crítica de tiempo de ejecución. La plataforma ha interceptado el error para proteger los límites de datos del tenant. Los detalles técnicos han sido enmascarados bajo directivas de DevSecOps.'}
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-left font-mono text-[10px] text-red-400 max-h-24 overflow-y-auto leading-normal">
                <strong>Exception:</strong> {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 border-none shadow-lg cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {isEn ? 'Reload Governance Suite' : 'Recargar Suite de Gobernanza'}
            </button>
            
            <p className="text-[10px] text-slate-500">
              {isEn 
                ? 'AI Governance Control Tower · Portfolio Security Isolation Gate' 
                : 'AI Governance Control Tower · Puerta de Aislamiento de Seguridad'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
