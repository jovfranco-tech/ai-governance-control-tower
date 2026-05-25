import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../contexts/AppContext';
import { SaaSProvider } from '../contexts/SaaSContext';
import { DataProvider } from '../contexts/DataContext';

// A simple component to smoke test context wrapping
const SmokeTestWidget = () => {
  return (
    <div data-testid="smoke-widget" className="p-4 bg-slate-900 text-white rounded">
      GRC Engine Active
    </div>
  );
};

describe('React Component Mounting & Context Smoke Tests', () => {
  it('should render GRC components successfully inside App, SaaS, and Data contexts', () => {
    render(
      <AppProvider>
        <SaaSProvider>
          <DataProvider>
            <SmokeTestWidget />
          </DataProvider>
        </SaaSProvider>
      </AppProvider>
    );

    const widget = screen.getByTestId('smoke-widget');
    expect(widget).toBeTruthy();
    expect(widget.textContent).toContain('GRC Engine Active');
  });
});
