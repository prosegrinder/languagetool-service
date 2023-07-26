import { IAnnotatedtext } from "annotatedtext";

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

export interface ILanguageToolReplacement {
  value: string;
  shortDescription: string;
}

export interface ILanguageToolLanguage {
  name: string;
  code: string;
  longCode: string;
}

export interface ILanguageToolInfo {
  name: string;
  version: string;
  buildDate: string;
  apiVersion: number;
  premium: boolean;
  premiumHint: string;
  status: string;
}

export interface ILanguageToolResponse {
  software: ILanguageToolInfo;
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

export interface ILanguageToolService {
  start(): Promise<boolean>;
  stop(): Promise<boolean>;
  ping(): Promise<boolean>;
  info(): Promise<ILanguageToolInfo>;
  dispose(): Promise<boolean>;
  isInstalled(): boolean;
  install(): Promise<boolean>;
  isUpdated(): boolean;
  update(): Promise<boolean>;
  getConfiguration(): ILanguageToolServiceConfiguration;
  setConfiguration(configuration: ILanguageToolServiceConfiguration): void;
  reloadConfiguration(
    configuration: ILanguageToolServiceConfiguration,
  ): Promise<boolean>;
  check(annotatedText: IAnnotatedtext): Promise<ILanguageToolResponse>;
  languages(): Promise<ILanguageToolLanguage[]>;
  getState(): string;
  getBaseURL(): string | undefined;
}

export interface ILanguageToolServiceConfiguration {
  host: string;
  port: number;
  basePath?: string;
  checkPath?: string;
  languagesPath?: string;
  parameters: {
    language: string;
    username?: string;
    apiKey?: string;
    dicts?: string[];
    motherTongue?: string;
    preferredVariants?: string[];
    enabledRules?: string[];
    disabledRules?: string[];
    enabledCategories?: string[];
    disabledCategories?: string[];
    enabledOnly?: string; // "true" | "false"
    level?: string; // "default" | "picky"
  };
}

export interface ILanguageToolServiceConfigurationParameters
  extends ILanguageToolServiceConfiguration {}
