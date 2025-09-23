
export function preOrderTraversal(data : string){ 


// data = '[ {"source":"1","target":"2","id":"xy-edge__1-2"},{"source":"1","target":"3","id":"xy-edge__1-3"},{"source":"3","target":"4","id":"xy-edge__3-4"},{"source":"3","target":"5","id":"xy-edge__3-5"},{"source":"3","target":"6","id":"xy-edge__3-6"},{"source":"2","target":"7","id":"xy-edge__2-7"},{"source":"2","target":"8","id":"xy-edge__2-8"},{"source":"2","target":"9","id":"xy-edge__2-9"},{"source":"2","target":"10","id":"xy-edge__2-10"},{"source":"4","target":"11","id":"xy-edge__4-11"},{"source":"4","target":"12","id":"xy-edge__4-12"},{"source":"4","target":"13","id":"xy-edge__4-13"},{"source":"7","target":"14","id":"xy-edge__7-14"}]';
let connections = JSON.parse(data); 
console.log(connections)
//@ts-ignore
connections.forEach(connection =>{ 
    connection.source = Number(connection.source );
    connection.target=Number(connection.target)
}
);

connections.sort((a :any,b :any )=> 
    a.source - b.source
)
console.log(connections)
let hehe :any[] = []
function filter(arr :any[], i :number ){ 
    if(i > arr.length){ 
        return
    }
    hehe.push(arr[i]);
    // console.log("pushed " + JSON.stringify(arr[i]))
    let target = arr[i].target; 
    
    for(let j = i ; j < arr.length ; j++){ 
        // console.log(" j " +   j)
        if (arr[j].source == target){ 
            // console.log(" source = " + JSON.stringify(arr[j].source) + "target " + JSON.stringify(target))
            filter(arr , j)
        }
    }
    i++;
    
  
    
    
}  
let bhag : boolean = true; 
let i = 0 ; 
while(bhag && hehe.length < connections.length){ 
    if(connections[i].source == 1){ 
        filter(connections , i )
    }
    else { 
        bhag = false
    }
    i++
}

console.log(hehe)
return hehe;

// console.log(connections);
}