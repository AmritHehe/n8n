export interface node { 
    id : number ;
    position : { x : number , y : number}
    type : 'trigger' | 'telegram' | 'gmail' | 'agent' | 'webhook'  ;
    data : { 
        label :  'trigger'| 'action'  ;
        webhook ?: boolean ;
        message ?: string ; 
        subject ?: string ;
        isExecuting ?: boolean ;
        to ?: string;
        afterPlayNodes ?: number
    };
    measured : { 
        width : number , 
        height : number
    };
  
    
}
// {
//     "id": "1",
//     "position": {
//       "x": 0,
//       "y": 0
//     },
//     "type": "trigger",
//     "data": {
//       "label": "Node 1"
//     },
//     "measured": {
//       "width": 64,
//       "height": 48
//     }
//   },
export interface edge { 
    id : string ; 
    source :  string ;
    target : string ; 
}
export interface users { 
    id : string ;
    name : string ; 
    pass : string ;
}
export interface TeligramCredentials{ 
    token : string;
}
export interface GmailCredentials{ 
    HOST : string ;
    PORT : number ;
    username : string ; 
    password : string 
}