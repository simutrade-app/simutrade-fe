import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIThinkingProcess from '../AIThinkingProcess';

// Mock the antd components to avoid complex setup
jest.mock('antd', () => ({
  Card: ({ children, title }: any) => (
    <div data-testid="card">
      <div data-testid="card-title">{title}</div>
      {children}
    </div>
  ),
  Typography: {
    Title: ({ children, level }: any) => <h1 data-testid={`title-${level}`}>{children}</h1>,
    Text: ({ children, type, strong }: any) => (
      <span data-testid={`text-${type || 'default'}`} className={strong ? 'strong' : ''}>
        {children}
      </span>
    ),
    Paragraph: ({ children }: any) => <p data-testid="paragraph">{children}</p>,
  },
  Row: ({ children }: any) => <div data-testid="row">{children}</div>,
  Col: ({ children }: any) => <div data-testid="col">{children}</div>,
  Space: ({ children }: any) => <div data-testid="space">{children}</div>,
  Tag: ({ children, color }: any) => <span data-testid={`tag-${color}`}>{children}</span>,
  Button: ({ children, onClick, icon }: any) => (
    <button data-testid="button" onClick={onClick}>
      {icon} {children}
    </button>
  ),
  Spin: ({ children }: any) => <div data-testid="spin">{children}</div>,
  Progress: ({ percent }: any) => <div data-testid="progress">{percent}%</div>,
  Alert: ({ message, description }: any) => (
    <div data-testid="alert">
      {message}: {description}
    </div>
  ),
  Tooltip: ({ children, title }: any) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  ),
}));

describe('AIThinkingProcess Component', () => {
  const mockSimulationData = {
    commodity: '1',
    transportMode: 'sea',
    originCountry: 'IDN',
    customDestination: 'New York',
  };

  const mockSimulationResultsWithDestination = {
    destination: {
      name: 'New York',
      lat: 40.7128,
      lng: -74.0060,
      country: 'USA'
    },
    costEstimate: 25000,
    timeEstimate: 14,
    transportMode: 'sea',
    originCountry: 'IDN',
  };

  const mockSimulationResultsWithoutDestination = {
    costEstimate: 25000,
    timeEstimate: 14,
    transportMode: 'sea',
    originCountry: 'IDN',
  };

  test('displays destination name when destination data is available', () => {
    render(
      <AIThinkingProcess
        simulationData={mockSimulationData}
        simulationResults={mockSimulationResultsWithDestination}
        isSimulating={false}
      />
    );

    // Look for the destination name in the rendered output
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  test('displays N/A when destination name is not available', () => {
    render(
      <AIThinkingProcess
        simulationData={mockSimulationData}
        simulationResults={mockSimulationResultsWithoutDestination}
        isSimulating={false}
      />
    );

    // Should display N/A when destination is not provided
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  test('displays destination emoji and label', () => {
    render(
      <AIThinkingProcess
        simulationData={mockSimulationData}
        simulationResults={mockSimulationResultsWithDestination}
        isSimulating={false}
      />
    );

    // Check for destination emoji and label
    expect(screen.getByText('🎯')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();
  });

  test('handles null simulation results gracefully', () => {
    render(
      <AIThinkingProcess
        simulationData={mockSimulationData}
        simulationResults={null}
        isSimulating={false}
      />
    );

    // Component should render without crashing
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  test('displays cost and time estimates when available', () => {
    render(
      <AIThinkingProcess
        simulationData={mockSimulationData}
        simulationResults={mockSimulationResultsWithDestination}
        isSimulating={false}
      />
    );

    // Check for cost and time display
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('14 days')).toBeInTheDocument();
  });

  test('displays simulation loading state', () => {
    render(
      <AIThinkingProcess
        simulationData={mockSimulationData}
        simulationResults={mockSimulationResultsWithDestination}
        isSimulating={true}
      />
    );

    // Component should handle loading state
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });
}); 