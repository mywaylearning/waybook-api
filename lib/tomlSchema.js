'use strict';

module.exports = {
    meta: {
        name: {
            type: String,
            required: true
        },
        version: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        pattern: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        analyzer: {
            type: Boolean,
            required: true
        }
    },
    answers: {
        type: Object,
        required: false
    },
    questions: {
        type: Object,
        required: true
    }
};
