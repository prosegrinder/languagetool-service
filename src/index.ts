import { IAnnotatedtext } from "annotatedtext";
import * as Fetch from "node-fetch";
import {
  ILanguageToolInfo,
  ILanguageToolLanguage,
  ILanguageToolResponse,
  ILanguageToolService,
  ILanguageToolServiceConfiguration,
} from "../types";
import { log } from "console";

export abstract class LanguageToolService implements ILanguageToolService {
  public readonly STATES = {
    IDLE: "idle",
    STARTING: "starting",
    READY: "ready",
    STOPPING: "stopping",
    STOPPED: "stopped",
    ERROR: "error",
  };
  public readonly DEFAULT_CHECK_PATH: string = "/check";
  public readonly DEFAULT_LANGUAGES_PATH: string = "/languages";
  public readonly DEFAULT_RULE_BASE_URI: string =
    "https://community.languagetool.org/rule/show/";
  public readonly DEFAULT_RULE_URL_LANG: string = "en";
  protected readonly PING_DATA: IAnnotatedtext = {
    annotation: [{ text: "Ping", offset: { start: 0, end: 4 } }],
  };

  protected _configuration: ILanguageToolServiceConfiguration;
  protected _state: string = this.STATES.STOPPED;
  protected _baseUrl: string | undefined = undefined;
  protected _checkPath: string = this.DEFAULT_CHECK_PATH;
  protected _languagesPath: string = this.DEFAULT_LANGUAGES_PATH;

  constructor(configuration: ILanguageToolServiceConfiguration) {
    this._configuration = configuration;
    this.setConfiguration(configuration);
  }

  public getBaseURL(): string | undefined {
    return this._baseUrl;
  }

  public getState(): string {
    return this._state;
  }

  public getConfiguration(): ILanguageToolServiceConfiguration {
    return this._configuration;
  }

  public setConfiguration(
    configuration: ILanguageToolServiceConfiguration,
  ): void {
    this._configuration = configuration;
  }

  public async reloadConfiguration(
    configuration: ILanguageToolServiceConfiguration,
  ): Promise<boolean> {
    await this.stop();
    this._configuration = configuration;
    return this.start();
  }

  public start(): Promise<boolean> {
    this._state = this.STATES.STARTING;
    return new Promise((resolve) => {
      this._state = this.STATES.READY;
      resolve(true);
    });
  }

  public stop(): Promise<boolean> {
    this._state = this.STATES.STOPPING;
    return new Promise((resolve) => {
      this._state = this.STATES.STOPPED;
      resolve(true);
    });
  }

  public dispose(): Promise<boolean> {
    return this.stop();
  }

  public ping(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // If we know the service isn't "running" then we won't ping it
      // This is to provide a consistent response to the user and consistent
      // behaviour across different implementations of the service
      if (this.STATES.READY === this.getState()) {
        this.check(this.PING_DATA)
          .then((response: ILanguageToolResponse) => {
            if (response) {
              resolve(true);
            } else {
              reject(new Error("Unexpected response from LanguageTool"));
            }
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        resolve(false);
      }
    });
  }

  public check(annotatedText: IAnnotatedtext): Promise<ILanguageToolResponse> {
    return new Promise((resolve, reject) => {
      const url = this.getBaseURL() + this._checkPath;
      if (url) {
        const parameters: Record<string, string> = {};
        parameters["data"] = JSON.stringify(annotatedText);
        for (const key in this._configuration.parameters) {
          const value: unknown =
            this._configuration.parameters[
              key as keyof ILanguageToolServiceConfiguration["parameters"]
            ];
          if (value instanceof Array) {
            parameters[key] = value.join(",");
          } else if (typeof value === "string") {
            parameters[key] = value;
          } else {
            throw new Error("Invalid parameter type.");
          }
        }

        const formBody = Object.keys(parameters)
          .map(
            (key: string) =>
              encodeURIComponent(key) +
              "=" +
              encodeURIComponent(parameters[key] as string),
          )
          .join("&");

        const options: Fetch.RequestInit = {
          body: formBody,
          headers: {
            Accepts: "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          method: "POST",
        };
        Fetch.default(url, options)
          .then((res) => res.json())
          .then((json) => resolve(json as ILanguageToolResponse))
          .catch((err) => {
            reject(err);
          });
      } else if (url === undefined) {
        this._state = this.STATES.ERROR;
        reject(new Error("LanguageTool URL is not defined"));
      } else if (this._state !== this.STATES.READY) {
        switch (this._state) {
          case this.STATES.STOPPED:
            reject(new Error("LanguageTool called on stopped service."));
            break;
          case this.STATES.STARTING:
            reject(new Error("LanguageTool called on starting service."));
            break;
          case this.STATES.STOPPING:
            reject(new Error("LanguageTool called on stopping service."));
            break;
          case this.STATES.ERROR:
            reject(new Error("LanguageTool called on errored service."));
            break;
          default:
            this._state = this.STATES.ERROR;
            reject(new Error("LanguageTool called on unknown service state."));
            break;
        }
      } else {
        this._state = this.STATES.ERROR;
        reject(new Error("Unknown error"));
      }
    });
  }

  public languages(): Promise<ILanguageToolLanguage[]> {
    return new Promise((resolve, reject) => {
      const url = this.getBaseURL() + this._languagesPath;
      if (this.STATES.READY === this.getState()) {
        const options: Fetch.RequestInit = {
          headers: {
            Accepts: "application/json",
          },
          method: "GET",
        };
        Fetch.default(url, options)
          .then((res) => res.json())
          .then((json) => resolve(json as ILanguageToolLanguage[]))
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error("LanguageTool not ready."));
      }
    });
  }

  public info(): Promise<ILanguageToolInfo> {
    return new Promise((resolve, reject) => {
      if (this.STATES.READY === this.getState()) {
        this.check(this.PING_DATA)
          .then((response: ILanguageToolResponse) => {
            return resolve(response.software);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error("LanguageTool not ready."));
      }
    });
  }

  public abstract isInstalled(): boolean;
  public abstract install(): Promise<boolean>;
  public abstract isUpdated(): boolean;
  public abstract update(): Promise<boolean>;
}
