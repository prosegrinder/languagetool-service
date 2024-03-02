import { Base } from "./base.js";
import { ILanguageToolServiceConfiguration } from "./types/index.js";

export class Remote extends Base {
  constructor(configuration: ILanguageToolServiceConfiguration) {
    super(configuration);
  }

  public async start(): Promise<boolean> {
    return new Promise((resolve) => {
      this._state = this.STATES.READY;
      resolve(true);
    });
  }

  public async stop(): Promise<boolean> {
    return new Promise((resolve) => {
      this._state = this.STATES.STOPPED;
      resolve(true);
    });
  }
}
