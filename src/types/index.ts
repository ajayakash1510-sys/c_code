export type ModuleId = 'home' | 'basics' | 'decisions' | 'loops' | 'patterns' | 'practice' | 'celebration';

export interface ModuleInfo {
  id: ModuleId;
  number: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  status: 'active' | 'coming_soon';
  topics: string[];
  icon: string;
  cyberConnection?: string;
  aiMlConnection?: string;
  estimatedMinutes: number;
}

export type SyntaxTokenType =
  | 'keyword'
  | 'type'
  | 'string'
  | 'number'
  | 'comment'
  | 'preprocessor'
  | 'function'
  | 'operator'
  | 'punctuation'
  | 'variable'
  | 'label'
  | 'default';

export interface SyntaxToken {
  text: string;
  type: SyntaxTokenType;
}

export interface CodeLine {
  lineNumber: number;
  text: string;
  tokens: SyntaxToken[];
}

export interface SimulationVariable {
  name: string;
  type: string;
  value: string | number;
  bytes: number;
  note?: string;
  status?: 'updated' | 'active' | 'neutral';
}

export interface StepExecutionState {
  stepIndex: number;
  totalSteps: number;
  activeLineNumber: number;
  explanation: string;
  subExplanation?: string;
  conditionEval?: {
    expression: string;
    evaluated: string;
    result: boolean;
  };
  variables: Record<string, SimulationVariable>;
  consoleLines: string[];
  branchReason?: string;
  isComplete: boolean;
}
