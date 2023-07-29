# languagetool-service

[![Node.js CI](https://github.com/prosegrinder/languagetool-service/actions/workflows/npm-ci.yaml/badge.svg?branch=main&event=push)](https://github.com/prosegrinder/languagetool-service/actions/workflows/npm-ci.yaml)

A lightweight JavaScript library for managing a [LanguageTool](https://languagetool.org) service. This is an abstract class.

## Installation

npm:

```sh
npm install languagetool-server
```

## Usage

Use this to implement concrete LanguageTool service classes.

```js
class LanguageToolServiceMock extends LanguageToolService {
  constructor(configuration: ILanguageToolServiceConfiguration) {
    super(configuration);
  }

  public setConfiguration(configuration: ILanguageToolServiceConfiguration) {
    this._configuration = configuration;
    this._baseUrl = `http://${configuration.host}:${configuration.port}/${configuration.basePath}`;
    if (configuration.checkPath) {
      this._checkPath = configuration.checkPath;
    }
    if (configuration.languagesPath) {
      this._languagesPath = configuration.languagesPath;
    }
  }

  public isInstalled(): boolean {
    return true;
  }

  public install(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  public isUpdated(): boolean {
    return true;
  }

  public update(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}
```

## Types

### ILanguageToolService

This is the main class to implement.

```js
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
    READY: string, // Service is ready
    STARTING: string, // Service is starting
    STOPPING: string, // Service is stopping
    IDLE: string, // Service is idle
    STOPPED: string, // Service is stopped
    ERROR: string, // Service is in error state
  };
}
```

### ILanguageToolServiceConfiguration

This is the configuration to implement.

```js
export interface ILanguageToolServiceConfiguration {
  host: string;
  port: number;
  basePath?: string;
  checkPath?: string;
  languagesPath?: string;
  ruleBaseURI?: string;
  parameters: {
    language: string,
    username?: string,
    apiKey?: string,
    dicts?: string[],
    motherTongue?: string,
    preferredVariants?: string[],
    enabledRules?: string[],
    disabledRules?: string[],
    enabledCategories?: string[],
    disabledCategories?: string[],
    enabledOnly?: string, // "true" | "false"
    level?: string, // "default" | "picky"
  };
}
```

### ILanguageToolMatch

```js
export interface ILanguageToolMatch {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: ILanguageToolReplacement[];
  context: {
    text: string,
    offset: number,
    length: number,
  };
  sentence: string;
  type: {
    typeName: string,
  };
  rule: {
    id: string,
    description: string,
    issueType: string,
    category: {
      id: string,
      name: string,
    },
  };
  ignoreForIncompleteSentence: boolean;
  contextForSureMatch: number;
}
```

### ILanguageToolReplacement

```js
export interface ILanguageToolReplacement {
  value: string;
  shortDescription: string;
}
```

### ILanguageToolLanguage

```js
export interface ILanguageToolLanguage {
  name: string;
  code: string;
  longCode: string;
}
```

### ILanguageToolInfo

```js
export interface ILanguageToolInfo {
  name: string;
  version: string;
  buildDate: string;
  apiVersion: number;
  premium: boolean;
  premiumHint: string;
  status: string;
}
```

### ILanguageToolResponse

```js
export interface ILanguageToolResponse {
  software: ILanguageToolInfo;
  warnings: {
    incompleteResults: boolean,
  };
  language: {
    name: string,
    code: string,
    detectedLanguage: {
      name: string,
      code: string,
      confidence: number,
    },
  };
  matches: ILanguageToolMatch[];
}
```
