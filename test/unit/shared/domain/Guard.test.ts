import { Guard, GuardArgumentCollection } from "../../../../src/shared/domain";

describe("Guard Clauses", () => {
  const nullValue = null;
  const undefinedValueInObject = {prop1: "String"};
  const arrayValue = Array;
  const objectValue = {};
  const collectionForTest: GuardArgumentCollection = [
    {argument: "I'm a string", argumentName: "prop1"},
    {argument: 555, argumentName: "prop2"},
    {argument: {}, argumentName: "prop3"}
  ];

  it("should against with 'null' values in againstNullOrUndefined()", () => {
    expect(Guard.againstNullOrUndefined(nullValue, "nullValue")).toEqual({
      succeeded: false,
      message: "nullValue is null or undefined"
    });
  });

  it("should against with 'undefined' values in againstNullOrUndefined()", () => {
    delete undefinedValueInObject.prop1;
    expect(Guard.againstNullOrUndefined(undefinedValueInObject.prop1, "prop1")).toEqual({
      succeeded: false,
      message: "prop1 is null or undefined"
    });
  });

  it("should in favor of string values in againstNullOrUndefined() ", () => {
    expect(Guard.againstNullOrUndefined(arrayValue, "arrayValue")).toEqual({succeeded: true});
  });

  it("should in favor of object values in againstNullOrUndefined() ", () => {
    expect(Guard.againstNullOrUndefined(objectValue, "objectValue")).toEqual({succeeded: true});
  });

  it("should against with 'null' values in againstNullOrUndefinedBulk()", () => {
    const collectionWithNulls: GuardArgumentCollection = [
      ...collectionForTest,
      {argument: null, argumentName: "prop4"}
    ];
    expect(Guard.againstNullOrUndefinedBulk(collectionWithNulls)).toEqual({
      succeeded: false,
      message: "prop4 is null or undefined"
    });
  });

  it("should against with 'undefined' values in againstNullOrUndefinedBulk()", () => {
    const collectionWithUndefined = collectionForTest;
    const LAST_ARGUMENT = 2;
    delete collectionWithUndefined[LAST_ARGUMENT].argument;
    expect(Guard.againstNullOrUndefinedBulk(collectionWithUndefined)).toEqual({
      succeeded: false,
      message: "prop3 is null or undefined"
    });
  });

});
