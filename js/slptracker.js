


function roninToAddr(ronin) {
    let arr = ronin.split(':');
    return '0x' + arr[1];
}

function splitTextarea(text) {
    let lines = text.split(String.fromCharCode(10));
    for(let i=0; i<lines.length; i++) {
        if(lines[i] == "") {
            lines.splice(i, 1);
        }
    }
    return lines;
}

function getName(address, next) {
    $.get("https://game-api.skymavis.com/game-api/clients/" + address + "/items/1", next);
}

function getSLP(address, next) {
    $.post(
        "https://graphql-gateway.axieinfinity.com/graphql",
        {
            "operationName":"GetProfileByRoninAddress",
            "variables":{
                "roninAddress":address
            },
            "query":"query GetProfileByRoninAddress($roninAddress: String!) {\n  publicProfileWithRoninAddress(roninAddress: $roninAddress) {\n    ...Profile\n    __typename\n  }\n}\n\nfragment Profile on PublicProfile {\n  accountId\n  name\n  addresses {\n    ...Addresses\n    __typename\n  }\n  __typename\n}\n\nfragment Addresses on NetAddresses {\n  ethereum\n  tomo\n  loom\n  ronin\n  __typename\n}\n"
        }
    ).done(next);
}

