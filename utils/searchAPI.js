const videosAPI = require('../utils/videosAPI');

exports.findByQuery = (query) => {
    return  new Promise(async (resolve, reject) => {
        const querySplitted = query.split('+');
        const regex = new RegExp(".*" + querySplitted.join(".*|.*") + ".*", 'i');

           resolve( {
                $or:[
                    {"videoname": querySplitted.join(' ')},
                    {"channelName": querySplitted.join(' ')},
                    {"videoname": {$regex : regex}},
                    {"channelName": {$regex : regex}},
                    {"tags": {$in: querySplitted}}
                ]
            });

    })
}