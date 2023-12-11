let scaleUpLoadPeriod = 1,
    scaleDownLimit = getParam("scaleDownLimit") || 2,
    scaleDownLoadPeriod = 5;

let resp = jelastic.billing.account.GetQuotas('environment.maxsamenodescount');
if (resp.result != 0) return resp;
let scaleUpLimit = resp.array[0] && resp.array[0].value ? resp.array[0].value : 1000;

if (scaleUpLimit <= scaleDownLimit) return {
    result: 0,
    warning: 'autoscaling triggers have not been added due to upLimit [' + scaleUpLimit + '] <= downLimit [' + scaleDownLimit + ']'
}

if (loadGrowth.toLowerCase() == "slow") {
    let scaleUpValue = 70,
        scaleDownValue = 20,
        scaleNodeCount = 1;
}

if (loadGrowth.toLowerCase() == "medium") {
    let scaleUpValue = 50,
        scaleDownValue = 20,
        scaleNodeCount = 1;
}

if (loadGrowth.toLowerCase() == "fast") {
    let scaleUpValue = 30,
        scaleDownValue = 10,
        scaleNodeCount = 2;
}

if (cleanOldTriggers) {
    let actions = ['ADD_NODE', 'REMOVE_NODE'];
    for (let i = 0; i < actions.length; i++) {
        let array = jelastic.env.trigger.GetTriggers(appid, session, actions[i]).array;
        for (let j = 0; j < array.length; j++) jelastic.env.trigger.DeleteTrigger(appid, session, array[j].id);
    }
}

resp = jelastic.env.trigger.AddTrigger('${env.envName}', session,
    {
        "isEnabled": true,
        "name": "scale-up",
        "nodeGroup": nodeGroup,
        "period": scaleUpLoadPeriod,
        "condition": {
            "type": "GREATER",
            "value": scaleUpValue,
            "resourceType": resourceType,
            "valueType": "PERCENTAGES"
        },
        "actions": [
            {
                "type": "ADD_NODE",
                "customData": {
                    "limit": scaleUpLimit,
                    "count": scaleNodeCount,
                    "notify": true
                }
            }
        ]
    }
);

if (resp.result != 0) return resp;

resp = jelastic.env.trigger.AddTrigger('${env.envName}', session,
    {
        "isEnabled": true,
        "name": "scale-down",
        "nodeGroup": nodeGroup,
        "period": scaleDownLoadPeriod,
        "condition": {
            "type": "LESS",
            "value": scaleDownValue,
            "resourceType": resourceType,
            "valueType": "PERCENTAGES"
        },
        "actions": [
            {
                "type": "REMOVE_NODE",
                "customData": {
                    "limit": scaleDownLimit,
                    "count": 1,
                    "notify": true
                }
            }
        ]
    }
);

return resp;