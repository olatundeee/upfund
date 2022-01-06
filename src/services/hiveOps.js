const { auth } = require("@hiveio/hive-js");
const hive = require("@hiveio/hive-js")
var jwt = require('jsonwebtoken');

const ops = {
    getTrending: async function() {
        var query = { limit : 3, tag : "hive" };
        hive.api.getDiscussionsByTrending30(query, function(err, data) {
            console.log(err, data);
        });
    },
    getToken: async function (username, password) {
        let authData = {
            auth: false,
            token: 'null',
            username: 'null',
            id: 'null',
            password: 'null'
        }
        const user = await hive.api.getAccountsAsync([username]);

        const pubWif = user[0].posting.key_auths[0][0];
    
            // check for the validity of the posting key
    
        if (hive.auth.isWif(password)) {
            // check if the public key tallies with the private key provided
            
            const Valid = hive.auth.wifIsValid(password, pubWif);
    
            if(Valid){
                // create token and store in token variable
    
                var token = await jwt.sign({ id: user._id }, 'config#2*Tm34', {
                    expiresIn: 86400
                });
                
                // if user authentication is successful send auth confirmation, token and user data as response

                authData.auth = true
                authData.token = token
                authData.username = user[0].name
                authData.id = user[0].id
                authData.password = password

                return authData
            } else {
                authData.auth = false
                authData.token = 'null'
                authData.username = 'null'
                authData.id = 'null'

                return authData
            }
        } else {
            authData.auth = false
            authData.token = 'null'
            authData.username = 'null'
            authData.id = 'null'

            return authData
        }
    },
    fetchMemo: async function(username) {
        let data = await hive.api.getAccountsAsync([username]);
        let pub_key = data[0].posting.key_auths[0][0];
        let memoData = {
            username,
            encoded
        };

        if (data.length === 1)
        {
            const speakBountiesWif = '5Hqg424NMKGe8PtkzmhCc5no2cCRYJCPq6b7YQwTJ28mj3wKYgx'

            var encoded = await hive.memo.encode(speakBountiesWif, pub_key, `log user in`);
            memoData.username = username
            memoData.encoded = encoded
            return memoData
        }
    },
    keychainCallback: async function (message, username) {
            let authData = {
                auth: false,
                token: 'null',
                username: 'null',
                id: 'null',
                keychain: 'null'
            }
        if (message) {
            var token = jwt.sign({ id: username }, 'config#2*Tm34', {
                expiresIn: 86400
            });
            const user = await hive.api.getAccountsAsync([username])
            authData.auth = true
            authData.token = token
            authData.username = user[0].name
            authData.id = user[0].id
            authData.keychain = 'yes'
            return authData
        }

    }
}

export default ops;