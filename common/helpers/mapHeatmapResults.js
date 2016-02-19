/**
 * Based on heatmap results, return propre key/values object
 */

'use strict';

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


function mapResponses(responses, result, questions, options) {
    Object.keys(responses).map((questionNumber) => {
        let answer = responses[questionNumber];
        let key = result[options[answer]];
        key.push(questions[questionNumber]);
    });

    return result;
}

module.exports = (responses, questions) => {

    let result = {};
    let options = responses.answers || {};
    let questionsMapped = {};
    let answers = responses.answers || [];
    Object.keys(answers).map(key => result[answers[key]] = []);

    /**
     * Remove object from responses, clean it for final response
     */
    delete responses.answers;

    questions.map(mapOrderQuestion(questionsMapped));
    return filter(mapResponses(responses, result, questionsMapped, options));
};
