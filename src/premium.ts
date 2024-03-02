import { Remote } from "./remote.js";
import { ILanguageToolServiceConfiguration } from "./types/index.js";

export class Premium extends Remote {
  constructor(configuration: ILanguageToolServiceConfiguration) {
    super(configuration);
    if (!configuration.parameters.username) {
      throw new Error("Username is required.");
    }
    if (!configuration.parameters.apiKey) {
      throw new Error("API key is required.");
    }
  }
}
