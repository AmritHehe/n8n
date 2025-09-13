export interface node { 
    id : number ;
    name : string ; 
    type : 'trigger'| 'action' | 'string' ;
    do : string  | 'mail' | 'teligram';
    done : boolean ;
    connection ?: boolean
    
}
export interface users { 
    id : string
    name : string ; 
    pass : string ;
}