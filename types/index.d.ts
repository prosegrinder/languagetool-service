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
  getConfiguration(): ILanguageToolServiceConfiguration; // Get the configuration
  check(annotatedText: IAnnotatedtext): Promise<ILanguageToolResponse>; // Check the annotated text
  languages(): Promise<ILanguageToolLanguage[]>; // Get the list of languages
  getState(): string; // Get the state of the service
  getBaseURL(): string; // Get the base URL of the service
  getCheckURL(): string; // Get the check URL of the service
  getLanguagesURL(): string; // Get the languages URL of the service
  getRuleURL(ruleId: string, language: string): string; // Get the rule base URI of the service
  readonly DEFAULT_BASE_PATH: string; // "/v2"
  readonly DEFAULT_CHECK_PATH: string; // "/check"
  readonly DEFAULT_LANGUAGES_PATH: string; // "/languages"
  readonly DEFAULT_RULE_BASE_URL: string; // "https://community.languagetool.org/rule/show/"
  readonly STATES: {
    readonly ERROR: string; // Service is in error state
    readonly IDLE: string; // Service is idle
    readonly READY: string; // Service is ready
    readonly STARTING: string; // Service is starting
    readonly STOPPED: string; // Service is stopped
    readonly STOPPING: string; // Service is stopping
  };
}

export interface ILanguageToolServiceConfiguration {
  baseURL: string; // Endpoint URL for the service
  checkPath?: string; // Path for the check endpoint (default: "/check")
  languagesPath?: string; // Path for the languages endpoint (default: "/languages")
  ruleBaseURL?: string; // Base URL for rules (default: "https://community.languagetool.org/rule/show/")
  parameters: {
    // see: https://languagetool.org/http-api/swagger-ui/#!/default/post_check
    language: string; // Language to check against
    username?: string; // Username for premium services
    apiKey?: string; // API key for premium services
    dicts?: string[]; // Dictionaries to use for premium services
    motherTongue?: string; // Mother tongue
    preferredVariants?: string[]; // Preferred variants
    enabledRules?: string[]; // Enabled rules
    disabledRules?: string[]; // Disabled rules
    enabledCategories?: string[]; // Enabled categories
    disabledCategories?: string[]; // Disabled categories
    enabledOnly?: string; // Only use enabled rules: "true" | "false" (default: "false")
    level?: string; // Enable additional picky rules: "default" | "picky" (default: "default")
  };
}
