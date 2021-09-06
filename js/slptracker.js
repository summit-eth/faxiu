


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

function getSLP(address, next) {
    $.get("https://game-api.skymavis.com/game-api/clients/" + address + "/items/1", next);
}

function getName(address, next) {
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

$(function() {
    
    var completed = 0;
    var ronin = [];
    
    function htmlProgress() {
        completed = 0;
        $("#trackerResults").html('<h3>Results:</h3><div id="trackerProgress" class="progress"><span width="100%"></span></div><div class="flex gaps grid-10"><div class="box col-7"><h5>Ronin Address</h5></div><div class="box col-2"><h5>Name</h5></div><div class="box col-1"><h5>SLP</h5></div></div>');
    }
    
    function htmlSLPResult(address, name, slp, i) {
        completed++;
        $("#trackerResults").append('<div class="flex gaps grid-10"><div class="box col-7">' + address + '</div><div class="box col-2">' + name + '</div><div class="box col-1">' + slp + '</div></div>');
        if(completed >= ronin.length) {
            $("#trackerProgress").remove();
        } else {
            setTimeout(function() {
                fetchData(i+1);
            }, 500);
        }
    }
    
    function fetchData(i) {
        let add = addr[i];
        getSLP(add, (slp) => {
            slp = slp.total - slp.claimable_total;
            getName(add, (name) => {
                name = name.data.publicProfileWithRoninAddress.name;
                htmlSLPResult(add, name, slp, i);
            });
        });
    }
   
    $("#btnFetch").click((e) => {
        
        try {
            ronin = $("#txtIskoList").val();
            ronin = splitTextarea(ronin);
            addr = ronin;
            if(ronin.length > 0) {
                for(let i=0; i<ronin.length; i++) {
                    addr[i] = roninToAddr(ronin[i]);
                }
                htmlProgress();
                fetchData(0);
            }
            
        } catch(e) {
            alert('error: ' + e);
        }
        
    });
    
});