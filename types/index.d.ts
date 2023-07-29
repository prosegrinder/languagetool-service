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
  start(): Promise<boolean>; // Start the service
  stop(): Promise<boolean>; // Stop the service
  ping(): Promise<boolean>; // Ping the service
  info(): Promise<ILanguageToolInfo>; // Get info from the service
  isInstalled(): boolean; // Check if the service is installed
  install(): Promise<boolean>; // Install the service
  isUpdated(): boolean; // Check if the service is updated
  update(): Promise<boolean>; // Update the service
  getConfiguration(): ILanguageToolServiceConfiguration; // Get the configuration
  setConfiguration(configuration: ILanguageToolServiceConfiguration): void; // Set the configuration
  check(annotatedText: IAnnotatedtext): Promise<ILanguageToolResponse>; // Check the annotated text
  languages(): Promise<ILanguageToolLanguage[]>; // Get the list of languages
  getState(): string; // Get the state of the service
  getBaseURL(): string | undefined; // Get the base URL of the service
  getCheckURL(): string | undefined; // Get the check URL of the service
  getLanguagesURL(): string | undefined; // Get the languages URL of the service
  getRuleURL(ruleId: string, language: string): string; // Get the rule base URI of the service
  DEFAULT_CHECK_PATH: string; // "/check"
  DEFAULT_LANGUAGES_PATH: string; // "/languages"
  DEFAULT_RULE_BASE_URI: string; // "https://community.languagetool.org/rule/show/"
  STATES: {
    READY: string; // Service is ready
    STARTING: string; // Service is starting
    STOPPING: string; // Service is stopping
    IDLE: string; // Service is idle
    STOPPED: string; // Service is stopped
    ERROR: string; // Service is in error state
  };
}

export interface ILanguageToolServiceConfiguration {
  host: string;
  port: number;
  basePath?: string;
  checkPath?: string;
  languagesPath?: string;
  ruleBaseURI?: string;
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
