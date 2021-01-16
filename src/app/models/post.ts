export class Post{
    key: string;
    header : string;
    desc : string;
    category : string;
    imgUrl : string;
    creator : string;
    creatorName: string;
    creatorPhoto:string;
    from : string;
    likeCount : number;
    commentCount : number;
    likes : {};
    comments :[];
    createDate:number;
}