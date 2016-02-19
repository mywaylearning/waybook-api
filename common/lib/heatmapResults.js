/**
 * Get heatmap results to create a discovery post
 */
'use strict';
let mapHeatmapResults = require('../helpers/mapHeatmapResults');
let async = require('async');

module.exports = (responses, exploration, Model, callback) => {
    let Question = Model.app.models.Question;
    let Answer = Model.app.models.Answer;
    let parallel = {};

    let query = {
        where: {
            explorationId: exploration.id
        }
    };

    parallel.questions = (after) => {
        return Question.find(query, after);
    };

    parallel.answers = (after) => {
        return Answer.find(query, (error, answers) => {
            if (error) {
                return after(error);
            }

            let result = {};

            (answers || []).map(answer => {
                result[answer.order] = answer.answer;
            });

            return after(null, result);
        });
    };

    return async.parallel(parallel, (error, data) => {
        if (error) {
            return callback(error);
        }

        responses.answers = data.answers || {};
        responses = mapHeatmapResults(responses || {}, data.questions);
        responses.pattern = exploration.pattern;
        responses.slug = exploration.slug;
        responses.name = exploration.name;
        responses.resultDisplayType = exploration.resultDisplayType;

        return callback(null, responses);
    });
};
