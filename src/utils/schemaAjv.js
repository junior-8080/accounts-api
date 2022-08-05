// With Ajv
const Ajv = require("ajv");
const addFormats = require("ajv-formats")

const ajv = new Ajv({ allErrors: true });
addFormats(ajv)

const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    age: {
      type: "integer",
    },
  },
  required: ["name"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

const data = {
    name: 2,
    age:4
}

const valid = validate(data);
if(!valid){
    console.log(validate.errors)
}

console.log(valid);