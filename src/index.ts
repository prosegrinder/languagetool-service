import { ILanguageToolService, ILanguageToolResponse } from "../types";
import { IAnnotatedtext } from "annotatedtext";

export abstract class LanguageToolService implements ILanguageToolService {
  public readonly STATES = {
    IDLE: "idle",
    STARTING: "starting",
    READY: "ready",
    STOPPING: "stopping",
    STOPPED: "stopped",
    ERROR: "error",
  };
  public readonly PARAMETERS: string[] = [
    "language",
    "motherTongue",
    "preferredVariants",
    "disabledCategories",
    "disabledRules",
  ];
  public readonly DEFAULT_CHECK_PATH: string = "/v2/check";
  public readonly DEFAULT_RULE_BASE_URI: string =
    "https://community.languagetool.org/rule/show/";
  public readonly DEFAULT_RULE_URL_LANG: string = "en-US";

  public abstract start(): Promise<boolean>;
  public abstract stop(): Promise<boolean>;
  public abstract ping(): Promise<boolean>;
  public abstract dispose(): Promise<boolean>;
  public abstract check(
    annotatedText: IAnnotatedtext,
  ): Promise<ILanguageToolResponse>;
  public abstract isInstalled(): boolean;
  public abstract install(): Promise<boolean>;
  public abstract isUpdated(): boolean;
  public abstract update(): Promise<boolean>;
  public abstract version(): string;
  public abstract getConfiguration(): any;
  public abstract setConfiguration(configuration: any): void;
  public abstract getState(): string;
  public abstract getURL(): string | undefined;
  public abstract reloadConfiguration(configuration: any): void;
}
