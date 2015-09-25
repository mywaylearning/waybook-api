'use strict';

/**
 * For convience and because this produc needs to be released soon, content is
 * hardcoded as part of the computation
 */
module.exports = {
    Extraversion: {
        description: 'High scorers tend to be sociable, friendly, fun loving, talkative. Low scorers tend to be introverted, reserved, inhibited, quiet.',

        levels: {
            low: 'You are a quiet, reserved individual who likes to keep to yourself most of the time.',
            mid: 'You are neither particularly social or reserved.',
            high: 'You are an outspoken person who enjoys attention.'
        },

        matrix: [{
            question: 1
        }, {
            question: 6,
            reverse: true
        }, {
            question: 11
        }, {
            question: 16
        }, {
            question: 21,
            reverse: true
        }, {
            question: 26
        }, {
            question: 31,
            reverse: true
        }, {
            question: 36
        }]
    },

    Agreeableness: {
        description: 'High scorers tend to be good natured, sympathetic, forgiving, courteous. Low scorers tend to be critical, rude, harsh, callous.',

        levels: {
            low: 'You have no problems telling it like is, but usually don\'t consider how your words or actions might affect other people.',
            mid: 'You are in the middle of the road. You neither go out of your way to disagree with people, nor do you always take other\'s feelings into consideration before you speak or act',
            high: 'You tend to consider the feelings of others before you speak or act.'
        },

        matrix: [{
            question: 2,
            reverse: true
        }, {
            question: 7
        }, {
            question: 12,
            reverse: true
        }, {
            question: 17
        }, {
            question: 22
        }, {
            question: 27,
            reverse: true
        }, {
            question: 32
        }, {
            question: 37,
            reverse: true
        }, {
            question: 42
        }]
    },

    Conscientiousness: {
        description: 'High scorers tend to be reliable, well organized, self-disciplined, careful. Low scorers tend to be disorganized, undependable, negligent.',

        levels: {
            low: 'You tend to be disorganized and hard to depend on.',
            mid: 'You are somewhat organized and usually (but not always) dependable.',
            high: 'You are very well organized and can be relied upon.'
        },

        matrix: [{
            question: 3
        }, {
            question: 8,
            reverse: true
        }, {
            question: 13
        }, {
            question: 18,
            reverse: true
        }, {
            question: 23,
            reverse: true
        }, {
            question: 28
        }, {
            question: 33
        }, {
            question: 38
        }, {
            question: 43,
            reverse: true
        }]
    },

    Neuroticism: {
        description: 'High scorers tend to be nervous, high-strung, insecure, worrying. Low scorers tend to be calm, relaxed, secure, hardy.',

        levels: {
            low: 'You probably remain calm, even in tense situations.',
            mid: 'You sometimes let tense situations get the best of you.',
            high: 'You tend to worry a lot and carry around a lot of stress. Tense situations probably lead to high levels of anxiety for you.'
        },

        matrix: [{
            question: 4
        }, {
            question: 9,
            reverse: true
        }, {
            question: 14
        }, {
            question: 19
        }, {
            question: 24,
            reverse: true
        }, {
            question: 29
        }, {
            question: 34,
            reverse: true
        }, {
            question: 39
        }]
    },

    Openness: {
        description: 'High scorers tend to be original, creative, curious, complex. Low scorers tend to be conventional, down to earth, narrow interests, uncreative.',

        levels: {
            low: 'You are a conventional, by the numbers type of person. You probably don\'t seek out new experiences very often.',
            mid: 'You are somewhat conventional, although you enjoy the occasional adventure.',
            high: 'You are highly unconventional and creative. You seek out new experiences, have a wide range of interests, and enjoy adventure.'
        },

        matrix: [{
            question: 5
        }, {
            question: 10
        }, {
            question: 15
        }, {
            question: 20
        }, {
            question: 25
        }, {
            question: 30
        }, {
            question: 35,
            reverse: true
        }, {
            question: 40
        }, {
            question: 41,
            reverse: true
        }, {
            question: 44
        }, {
            question: 45
        }]
    }
};
