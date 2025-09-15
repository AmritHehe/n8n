export interface node { 
    id : number ;
    name : string ; 
    type : 'trigger'| 'action' | 'string' ;
    do : string  | 'mail' | 'teligram';
    done : boolean ;
    connection ?: boolean
    
}
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