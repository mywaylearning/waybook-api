# Overview

This describes the resources that make up the Waybook API. If you have any problems or requests, please contact Way Support.

## Current Version

By default, all requests receive the **v1** version of the API. We encourage you to explicitly request this version via the HTTP `Accept` header.

```
Accept: application/vnd.waybook.v1+json
```

## Schema

All API access is over HTTPS, and accessed through the `api.way.me` domain. All data is sent and received as JSON.

## Parameters

Many API methods accept optional parameters. For `GET` requests, any parameters not specified as a segment in the path can be passed as an HTTP query string parameter. For example:

```shell
$ curl -i "https://api.way.me/goals?order=deadline"
```

## HTTP Verbs and Content-Types

Where possible, we strive to use appropriate and intuitive HTTP verbs for each action.

Verb | Content-Type | Description 
-----|------------|-----
`HEAD` | n/a | Can be issued against any resource to get basic information. 
`GET` | n/a | Used for retrieving resources.
`POST` | `application/json` | Used for creating resources.
`PATCH` | `application/json-patch+json` | Used for updating resources with partial information. Please see [RFC 6902](http://tools.ietf.org/html/rfc6902) for technical details on JSON Patch. For a quick introduction, see [JSONPatch.com](http://jsonpatch.com).
`PUT` | `application/json` | Used for replacing resources or collections of resources. 
`DELETE` | n/a | Used for deleting resources. 
`OPTIONS` | n/a | Used for determining Cross-Origin Resource Sharing ([CORS](http://enable-cors.org)) capabilities.



