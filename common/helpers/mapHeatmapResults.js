/**
 * Based on heatmap results, return propre key/values object
 */

'use strict';

let options = {
    '1': 'I don\'t know or neutral',
    '2': 'must have (a core value)',
    '3': 'should have',
    '4': 'nice to have',
    '5': 'avoid'
};

function mapOrderQuestion(object) {
    return (question) => {
        object[question.order] = question.question;
    };
}

function filter(result) {
    let data = {};
    Object.keys(result).filter(key => {
        if (result[key].length) {
            data[key] = result[key];
        }
    });

    return data;
}


function mapResponses(responses, result, questions) {
    Object.keys(responses).map((questionNumber) => {
        let answer = responses[questionNumber];
        let key = result[options[answer]];
        key.push(questions[questionNumber]);
    });

    return result;
}

module.exports = (responses, questions) => {

    /**
     * TODO: Get answers from exploration answers.
     * Due budget is defined as static content. We need to release this asap
     */
    let result = {
        'I don\'t know or neutral': [],
        'must have (a core value)': [],
        'should have': [],
        'nice to have': [],
        'avoid': [],
    };

    let questionsMapped = {};
    questions.map(mapOrderQuestion(questionsMapped));
    return filter(mapResponses(responses, result, questionsMapped));
};
