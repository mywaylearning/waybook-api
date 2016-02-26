'use strict';

require('dotenv').load();
let server = require('../server/server.js');

let details = {
    'stan@example.com': [{
        propertyName: 'firstName',
        propertyGroup: 'userInfo',
        valueType: 's',
        valueString: 'Stan'
    }, {
        propertyName: 'lastName',
        propertyGroup: 'userInfo',
        valueType: 's',
        valueString: 'Man'
    }, {
        propertyName: 'birthday',
        propertyGroup: 'userInfo',
        valueType: 'd',
        valueString: '1965-05-12'
    }],
    'chet@example.com': [{
        propertyName: 'firstName',
        propertyGroup: 'userInfo',
        valueType: 's',
        valueString: 'Chet'
    }, {
        propertyName: 'lastName',
        propertyGroup: 'userInfo',
        valueType: 's',
        valueString: 'Smith'
    }, {
        propertyName: 'birthday',
        propertyGroup: 'userInfo',
        valueType: 'd',
        valueString: '1972-02-17'
    }],
    'bob@example.com': [{
        propertyName: 'firstName',
        propertyGroup: 'userInfo',
        valueType: 's',
        valueString: 'Bob'
    }, {
        propertyName: 'lastName',
        propertyGroup: 'userInfo',
        valueType: 's',
        valueString: 'Jones'
    }, {
        propertyName: 'birthday',
        propertyGroup: 'userInfo',
        valueType: 'd',
        valueString: '1969-12-01'
    }]
};

let detail = [];
let detailItem = {};
let detailUpdates = [];
let usersData = [{
    email: 'stan@example.com',
    password: 'stan',
    firstName: 'stan',
}, {
    email: 'chet@example.com',
    firstName: 'chet',
    password: 'chet'
}, {
    email: 'bob@example.com',
    firstName: 'bob',
    password: 'bob'
}];

server.models.WaybookUser.create(usersData, function(err, users) {

    if (err) {
        console.error('Error creating users', err);
        process.exit(1);
    }

    users.forEach(function(user) {
        detail = details[user.email];
        detail.forEach(function(item) {
            detailItem = item;
            detailItem.userId = user.id;
            detailUpdates.push(detailItem);
        });
    });

    server.models.WaybookUserDetail.create(detailUpdates, function(error, data) {
        if (error) {
            console.error(error);
            return process.exit(1);
        }

        console.log(data);
        process.exit(0);
    });
});
