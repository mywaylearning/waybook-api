# Modular Swagger Spec

Maintaining a Swagger spec by hand is a challenge, but a worthy challenge if you care about the interface you present to developers. To make it easier to manage, we use a modular filesystem to deal with it. Here's how it works.

## Requirements

This system is dependent upon these tools:

  * npm packages
    * js-yaml
	* swagger-tools
  * Development environment
    * node.js

## Hierarchy Explained

The entry point is in the top level file `spec.yaml`.

Within `spec.yaml`, custom Yaml tags `!!duke/incFile` and `!!duke/incDir` are used to join modules together. The complete spec is written out to `swagger.json`.

## Generating Swagger

Simply run `npm run generate-swagger` from the top level of the project.