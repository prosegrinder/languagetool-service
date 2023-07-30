/* eslint-disable @typescript-eslint/no-var-requires */
// "use strict";

import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { LanguageToolService } from "../src/index.js";
import { ILanguageToolServiceConfiguration } from "../types/index.d";
import { IAnnotatedtext } from "annotatedtext";

chai.use(chaiAsPromised);
chai.should();
const assert = chai.assert;

interface ILanguageToolServiceMockConfiguration
  extends ILanguageToolServiceConfiguration {
  host: string;
  port: number;
}

class LanguageToolServiceMock extends LanguageToolService {
  constructor(configuration: ILanguageToolServiceMockConfiguration) {
    // Ensure baseURL matches host and port
    configuration.baseURL = new URL(
      `http://${configuration.host}:${configuration.port}/v2`,
    );
    super(configuration);
  }
}

const configuration: ILanguageToolServiceMockConfiguration = {
  host: "127.0.0.1",
  port: 8081,
  baseURL: new URL("http://127.0.0.1:8081/v2"),
  parameters: {
    language: "en-US",
    motherTongue: "en-US",
  },
};

const testDocument: IAnnotatedtext = {
  annotation: [
    {
      text: "This is a test.",
      offset: { start: 0, end: 14 },
    },
  ],
};

const service = new LanguageToolServiceMock(configuration);

describe("#constructor()", function () {
  it("should instantiate a new service", function () {
    assert.instanceOf(service, LanguageToolService);
  });
});

describe("#getBaseURL()", function () {
  it("should return a valid URL", function () {
    const url: URL = service.getBaseURL();
    url.should.equal(configuration.baseURL);
  });
});

describe("#getState()", function () {
  it("should return the current state as STOPPED", function () {
    const state: string = service.getState();
    state.should.equal(service.STATES.STOPPED);
  });
});

describe("#start()", function () {
  it("should start the service", function (done) {
    service.start().should.eventually.be.true.notify(done);
  });
});

describe("#getState()", function () {
  it("should return the current state as READY", function () {
    const state: string = service.getState();
    state.should.equal(service.STATES.READY);
  });
});

describe("#languages()", function () {
  it("should return an array of supported languages", function (done) {
    service.languages().should.eventually.be.an("array").notify(done);
  });
});

describe("#ping()", function () {
  it("should return a valid LanguageToolPingResponse", function (done) {
    service.ping().should.eventually.be.true.notify(done);
  });
});

describe("#info()", function () {
  it("should return a valid LanguageToolInfoResponse", function (done) {
    service
      .info()
      .should.eventually.be.an("object")
      .with.keys(
        "apiVersion",
        "buildDate",
        "name",
        "premium",
        "premiumHint",
        "status",
        "version",
      )
      .notify(done);
  });
});

describe("#check()", function () {
  it("should return a valid LanguageToolResponse", function (done) {
    service
      .check(testDocument)
      .should.eventually.be.an("object")
      .with.keys(
        "software",
        "warnings",
        "language",
        "matches",
        "sentenceRanges",
      )
      .notify(done);
  });
});

describe("#stop()", function () {
  it("should stop the service", function (done) {
    service.stop().should.eventually.be.true.notify(done);
  });
});

describe("#getState()", function () {
  it("should return the current state as STOPPED", function () {
    const state: string = service.getState();
    state.should.equal(service.STATES.STOPPED);
  });
});
