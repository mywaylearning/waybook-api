# Waybook

You'll need the following tools outside of those provided by `npm` to contribute to development on this project.

* [closure-linter](https://developers.google.com/closure/utilities/):

Javascript style tools from Google.

`brew install closure-linter` or `pip install closure-linter`

Be sure to check out the `npm run *` scripts in `package.json`.

## Localdev API scratchpad

curl -k -u "4c794dd53729fa8f55b97df21e48c7b6:a5d099b126700afec5acd5d2f5f94e33c5b6a419" --data "grant_type=password&username=bob@example.com&password=bob" -i https://localdev.way.me:8443/login

curl -i -H "Authorization: Bearer 0BVC5hpRgGII0NQ7szev2SKoi1pkjj8H" http://localhost:3000/me

curl -k -u "4c794dd53729fa8f55b97df21e48c7b6:a5d099b126700afec5acd5d2f5f94e33c5b6a419" --data "grant_type=refresh_token&refresh_token=lxlTrKt1M1HT59HFhwZ0W9M5bO4o28vQ&client_id=4c794dd53729fa8f55b97df21e48c7b6" -i https://localdev.way.me:8443/refresh

curl -i -H "Authorization: Bearer 9TpDlebGyj40Xm8RVKPUCLA1sFVAIVIA" http://localhost:3000/user

## Localdev environment variables

Create a file named `.env` in the root of `waybook-api` directory, or set these
environment variables in your local environment through your `.bashrc`.

```
WAYBOOK_DB_PASSWORD=....
WAYBOOK_DB_USER=waybook
WAYBOOK_DB_HOST=127.0.0.1
WAYBOOK_DB_SSL=false
DEBUG=*,-strong-agent:*,-strong-statsd:*
WAYBOOK_DB_SSL=false
WAYBOOK_SENDGRID_KEY=...
WAYBOOK_CONFIRM_TEMPLATE_ID=...
WAYBOOK_WEB_CLIENT_URL=http://localhost:8100/#!/
DEBUG=way*,-strong-agent:*,-strong-statsd:*
```

Also in order to turn on/off log/output from database, you can change
`server/datasources.local.js` and set:

```js
debug: false, //or true
```

We **do** use SSL in all Amazon instances, but it is not currently enabled for
localdev environments.

## Mac development environment

We may switch to docker soon. In the meantime, however:

1. Install `mysql` from [the MySQL site](http://dev.mysql.com/downloads/mysql/)
2. Install `nginx`. `$ brew install nginx`
3. Download the `way-ssl.zip` file from the `#develop` channel in Slack.
4. Get a password to unzip that file from John or Clay.
5. Extract `way-ssl.zip` and follow the instructions in the README.
6. Copy the `authserver/nginx-localdev.conf` file to `/usr/local/etc/nginx/nginx.conf`
7. Start nginx with `nginx`

## Ubuntu 14.04 development environment

We may switch to docker soon. In the meantime, however:

1. Install `mysql`

```
sudo apt-get install mysql-server-5.6
```

2. Install `nginx`. [official docs](http://wiki.nginx.org/Install)
3. Download the `way-ssl.zip` file from the `#develop` channel in Slack.
4. Get a password to unzip that file from John or Clay.
5. Extract `way-ssl.zip` and follow the instructions in the README.
6. Copy the `./authserver/nginx-localdev.conf` file to `/etc/nginx/nginx.conf`
7. Start nginx with `sudo service nginx start`

## Localdev setup & runtime

After you've got the necessary environment variables set, run the MySQL setup
scripts. (Assuming you've done the local environment setup steps described
below!)

Install `db-migrate` node module

```
npm install -g db-migrate
```

```
$ db-migrate up -e localdev
$ npm run localdev-setup
$ npm start
```

### Important! About upgrade loopback?

Loopback dependencies are locked due the license agreement. Ask John before
any upgrade related.

### About share xPosts

#### With existing users

- Current user will choose a contact from contact list on share field.

- User will *POST* xpost with share options (wich includes contact's waybookId associated)

- System will store `userId`, `postId` and `sharedWith` on `Share` table. Where:

  - `userId` means current user ID
  - `postId` means current post to share
  - `sharedWith` a *waybook* user id associated to current user contact

#### With non existing contact

 - Current user will add an email(or many) to share field
 - System will create a contact(supporter) associated to current user
 - *system could store `sharedWithContact` using contact's ID*

After new user (*bob*) creates an account with `x@x.com` email:

 - System will looks for all contacts where email = `x@x.com`
 - Add *bob*'s id to all contacts from previous query
 - Looks for all `Share` where `shareWithContact` equals found contacts and add `shareWith` to *bob*'s ID
