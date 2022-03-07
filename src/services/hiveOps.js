import {keychain, isKeychainInstalled, hasKeychainBeenUsed} from '@hiveio/keychain'
import axios from 'axios';

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

    },
    voteContent: async function (author, permlink, voter, weight) {

        const vote = {
            author,
            permlink,
            voter,
            weight
        };

        const operation = ['vote', vote]

        const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestTransfer', 'test', author, 5,  'test memo', 'HIVE')
        
        const keychainStatus = localStorage.getItem('keychain')

        if(isKeychainInstalled && keychainStatus === 'yes') {
            // do your thing

            try {
                const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestBroadcast', voter, [operation], 'Posting');

                if (success) {
                    return {success: 'yes'}
                }
                
            } catch (error) {
                console.log(error)
                alert('Error encountered')
            }
        }
        // User didn't cancel, so something must have happened
        else if(!cancel) {
            if(notActive) {
                alert('Please allow Keychain to access this website')
            } else {
                try {
                    const dybnjg = localStorage.getItem('ajbhs')
                    const sendPost = await hive.broadcast.voteAsync(dybnjg, voter, author, permlink, weight)
                    if (sendPost.id) {
                        return {success: 'yes'}
                    }
                } catch (error) {
                    console.log(error)
                    alert('Error encountered')
                    
                }
            }
        }
    },
    checkVote: async function (author, permlink, username) {
        const post = await hive.api.getContentAsync(author, permlink);
        let voted = false;

        if (username !== null) {
            await post.active_votes.forEach(y => {
                if (y.voter === username) {
                    voted = true
                }
            });
        }

        return voted
                
    },
    reblogContent: async function (author, permlink, username) {
        const operation = [
            "custom_json",
            {
                "required_auths": [],
                "required_posting_auths": [username],
                "id": "reblog",
                "json": JSON.stringify([
                    "reblog", {
                        "account": username, 
                        "author": author,
                        "permlink": permlink
                    }
                ])
            }
        ]

        const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestTransfer', 'test', author, 5,  'test memo', 'HIVE')
        
        const keychainStatus = localStorage.getItem('keychain')

        if(isKeychainInstalled && keychainStatus === 'yes') {
            // do your thing

            try {
                const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestBroadcast', username, [operation], 'Posting');

                if (success) {
                    return {success: 'yes'}
                }
                
            } catch (error) {
                console.log(error)
                alert('Error encountered')
            }
        }
        // User didn't cancel, so something must have happened
        else if(!cancel) {
            if(notActive) {
                alert('Please allow Keychain to access this website')
            } else {
                try {
                    const dybnjg = localStorage.getItem('ajbhs')
                    const json = JSON.stringify([
                        "reblog", {
                            "account": username, 
                            "author": author,
                            "permlink": permlink
                        }
                    ])
                    const sendPost = await hive.broadcast.customJsonAsync(dybnjg, [], [username], 'reblog', json)
                    if (sendPost.id) {
                        return {success: 'yes'}
                    }
                } catch (error) {
                    console.log(error)
                    alert('Error encountered')
                    
                }
            }
        }
    },
    followUser: async function (userToFollow, follower) {
        const operation = [
                "custom_json",
                {
                  "required_auths": [],
                  "required_posting_auths": [follower],
                  "id": "follow",
                  "json": JSON.stringify([
                    "follow", {
                        "follower":follower, 
                        "following":userToFollow,
                        "what":["blog"]
                    }
                ])
                }
            ]

        const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestTransfer', 'test', follower, 5,  'test memo', 'HIVE')
        
        const keychainStatus = localStorage.getItem('keychain')

        if(isKeychainInstalled && keychainStatus === 'yes') {
            // do your thing

            try {
                const {success, msg, cancel, notInstalled, notActive} = await keychain(window, 'requestBroadcast', follower, [operation], 'Posting');

                if (success) {
                    return {success: 'yes'}
                }
                
            } catch (error) {
                console.log(error)
                alert('Error encountered')
            }
        }
        // User didn't cancel, so something must have happened
        else if(!cancel) {
            if(notActive) {
                alert('Please allow Keychain to access this website')
            } else {
                try {
                    const dybnjg = localStorage.getItem('ajbhs')
                    const json = JSON.stringify([
                        'follow', {follower: follower, following: userToFollow, what: ["blog"]}
                    ])
                    const sendFollow = await hive.broadcast.customJsonAsync(dybnjg, [], [follower], 'follow', json)
                    if (sendFollow.id) {
                        return {success: 'yes'}
                    }
                } catch (error) {
                    console.log(error)
                    alert('Error encountered')
                    
                }
            }
        }
    },
    checkFollowing: async function (follower, following) {
        async function runCheck () {
            let finalFollowArr = [];
            let startFollowers = ''
            const followCount = await hive.api.getFollowCountAsync(following)
            let followingLoop = await hive.api.getFollowersAsync(following, startFollowers, 'blog', 1000);
            finalFollowArr = finalFollowArr.concat(followingLoop)
            do {
                const lastFollower = followingLoop ? followingLoop[followingLoop.length - 1] : {follower: ''}

                if (lastFollower && (lastFollower !== null || lastFollower !== undefined) && lastFollower) {
                    startFollowers = lastFollower.follower
                }
                followingLoop = await hive.api.getFollowersAsync(following, startFollowers, 'blog', 1000);
                finalFollowArr = finalFollowArr.concat(followingLoop)
            }
            while  (finalFollowArr.length !== followCount.follower_count)
            let followed = false;

            if (finalFollowArr.length === followCount.follower_count) {
                for (let i = 0; i < finalFollowArr.length; i++) {
                    if (finalFollowArr[i].follower === follower) {
                        followed = true
                    }
                }
                return followed
            }
        }

        const getStatus = await runCheck()
        return getStatus;
    },
    getPopularCommunities: async function () {
        let popularCommunities = [{community: {name: '', title: 'Choose'}}]
        
        let commies = await axios.post(
            'https://api.hive.blog', 
            JSON.stringify({
                "jsonrpc":"2.0", "method":"bridge.list_communities", "params":{"limit": 100, sort: 'rank'}, "id":1
            })
        )
        
        async function sortCommies(v) {
            for (let i = 0; i <= v.length - 1; i++) {
                let oneCommie = v[i];
                console.log(oneCommie)
                popularCommunities.push({community: {name: oneCommie.name, title: oneCommie.title}})

                if (i === v.length - 1) {
                    return popularCommunities
                }
            }
        }


        const communities = await sortCommies(commies.data.result)
        console.log(communities)
        return communities;
    },
    getFollowCount: async function (user) {
        const followCount = await hive.api.getFollowCountAsync(user)
        return followCount;
    },
    getAccountPosts: async function (user, sort) {
        let posts = await axios.post(
            'https://api.hive.blog', 
            JSON.stringify({
                "jsonrpc":"2.0", "method":"bridge.get_account_posts", "params":{"sort": sort, "account": user, "limit": 100}, "id":1
            })
        )

        return posts.data.result
    }
}

export default ops;