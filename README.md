# Waybook

You'll need the following tools outside of those provided by `npm` to contribute to development on this project.

 * [closure-linter](https://developers.google.com/closure/utilities/): Javascript style tools from Google. `brew install closure-linter` or `pip install closure-linter`

Be sure to check out the `npm run *` scripts in `package.json`.

## Localdev API scratchpad

    curl -k -u "4c794dd53729fa8f55b97df21e48c7b6:a5d099b126700afec5acd5d2f5f94e33c5b6a419" --data "grant_type=password&username=bob@example.com&password=bob" -i https://localdev.way.me:8443/login

	curl -i -H "Authorization: Bearer 0BVC5hpRgGII0NQ7szev2SKoi1pkjj8H" http://localhost:3000/me

	curl -k -u "4c794dd53729fa8f55b97df21e48c7b6:a5d099b126700afec5acd5d2f5f94e33c5b6a419" --data "grant_type=refresh_token&refresh_token=lxlTrKt1M1HT59HFhwZ0W9M5bO4o28vQ&client_id=4c794dd53729fa8f55b97df21e48c7b6" -i https://localdev.way.me:8443/refresh

	curl -i -H "Authorization: Bearer 9TpDlebGyj40Xm8RVKPUCLA1sFVAIVIA" http://localhost:3000/user

## Localdev environment variables

Create a file named `.env` in the root of `waybook-api` directory, or set these environment variables in your local environment through your `.bashrc`.

```
WAYBOOK_DB_PASSWORD=....
WAYBOOK_DB_USER=waybook
WAYBOOK_DB_HOST=127.0.0.1
WAYBOOK_DB_SSL=false
DEBUG=*,-strong-agent:*,-strong-statsd:*
```

We **do** use SSL in all Amazon instances, but it is not currently enabled for localdev environments.

## Localdev setup & runtime

After you've got the necessary environment variables set, run the MySQL setup scripts.

```shell
$ db-migrate up -e localdev
$ npm run localdev-setup
$ npm start
```
