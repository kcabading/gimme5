import Redis from "ioredis"

const client = new Redis(process.env.REDIS_CON_STRING);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
    console.log('EVENT', event)
    let response = {}
    const method = event.httpMethod
    const queryParams = event.queryStringParameters
    const leaderboardsData = [];
    let results = []
    
    switch(method) {
        case 'GET':
            const dataBy = queryParams.dataBy
            if (dataBy === 'userPoints') {
                results = await client.zrevrange('leaderboardsByUserPoints', 0, -1, "WITHSCORES")
            } else if 
            (dataBy === 'userCompleted') {
                results = await client.zrevrange('leaderboardsByUserCompleted', 0, -1, "WITHSCORES")
            }
    }

    // const result = await client.set('foo', 'bar');
    
    // const result = await client.zadd("sortedSet", 1, "one", 2, "dos", 4, "quatro", 3, "three");
    // const result = await client.zrange("sortedSet", 0, 2, "WITHSCORES")
    
    // const scores = [
    //     { name: "Bob", score: 80 },
    //     { name: "Jeff", score: 59.5 },
    //     { name: "Tom", score: 100 },
    //     { name: "Alex", score: 99.5 },
    //  ];
      
    // // const scoreMap = scores.map(({ name, score }) => [score, name])
    // // console.log('SCORE MAP', scoreMap)
    // const result = await client.zadd(
    //     "leaderboardsByUserPoints",
    //     [7,'irene'], [10,'theo']
        
    // );
    
    
    for (let i = 0; i < results.length; i += 2) {
        const username = results[i];
        const points = Number(results[i + 1]);
        if (i > 20) break
        leaderboardsData.push({ username, points });
    }
    
    console.log('LEADERBOARDS', leaderboardsData)

    return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(leaderboardsData),
    };
};
