const request = require("request");

const saveRequest = require("./history").save;

// const config = require("../config");

// const clientID = process.env.CLIENT_ID || config.CLIENT_ID;

const clientID = process.env.CLIENT_ID

exports.getImage = function(search, page = 1) {

    return new Promise((resolve, reject) => {

        let options = {
            url: `https://api.imgur.com/3/gallery/search/${page}?q=${search}`,
            headers: { Authorization: 'Client-ID ' + clientID },
            json: true,
        };

        request(options, getPics);


        function getPics(err, response, body) {

            if (!err && response.statusCode == 200) {

                saveRequest(search, (data, err) => {
                    if (err) {
                        console.log(err);
                    }
                });

                body = body.data.filter(image => {

                    if (!image.is_album) {
                        return image;
                    }

                }).map(image => {

                    return {
                        search: search,
                        url: image.link,
                        snippet: image.title,
                        context: `https://imgur.com/${image.id}`
                    };

                });

                if (body.length >= page ) {
                    body = body.slice(0, page);
                }

                resolve(body);

            }

        }

    });

};
