import { IAnnotatedtext } from "annotatedtext";

// Interface - LanguageTool Match
export interface ILanguageToolMatch {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: ILanguageToolReplacement[];
  context: {
    text: string;
    offset: number;
    length: number;
  };
  sentence: string;
  type: {
    typeName: string;
  };
  rule: {
    id: string;
    description: string;
    issueType: string;
    category: {
      id: string;
      name: string;
    };
  };
  ignoreForIncompleteSentence: boolean;
  contextForSureMatch: number;
}

// Interface LanguageTool Replacement
export interface ILanguageToolReplacement {
  value: string;
  shortDescription: string;
}

// Interface - LanguageTool Response
export interface ILanguageToolResponse {
  software: {
    name: string;
    version: string;
    buildDate: string;
    apiVersion: number;
    premium: boolean;
    premiumHint: string;
    status: string;
  };
  warnings: {
    incompleteResults: boolean;
  };
  language: {
    name: string;
    code: string;
    detectedLanguage: {
      name: string;
      code: string;
      confidence: number;
    };
  };
  matches: ILanguageToolMatch[];
}

// Interface - LanguageTool Service
export interface ILanguageToolService {
  start(): Promise<boolean>;
  stop(): Promise<boolean>;
  ping(): Promise<boolean>;
  dispose(): Promise<boolean>;
  isInstalled(): boolean;
  install(): Promise<boolean>;
  isUpdated(): boolean;
  update(): Promise<boolean>;
  version(): string;
  reloadConfiguration(configuration: any): void;
  check(annotatedText: IAnnotatedtext): Promise<ILanguageToolResponse>;
  getState(): string;
  getURL(): string | undefined;
}
