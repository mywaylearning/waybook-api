# Watson

TOC

## Why Watson?

## Approach for initial version

1. Find the simplest and most maintainable way to build this to meet these specs or come up with a better idea
2. Treat this as an exploration that we define and load via a TOML file just like all explorations. See the TOML file text here.
3. The API calls to Watson is done on the backend. The front end just hits our APIs.
4. We must check whether we have more than 3500 words. If not, we ask for more. When they paste text in the text box, it should tell them how many words they have.
5. If the call fails, we need to make the exploration fail gracefully in the eyes of the end user.
6. Can we track and limit the number of calls we make to Watson in a given month?
7. The return result is a paragraph description and the table.  From the demo link above, it contains the following type of information (disregard the colors and heading layouts...we can make it look nicer

## Libraries

For now, we just need **Node.js** based library. They provide this [node package](https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/personality-insights/api/v2/?node#profile)

```
npm install watson-developer-cloud
```