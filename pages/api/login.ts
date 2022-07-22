import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse<{ authKey: string } | any>) {
    if(request.method == "POST") return POST(request,response);
}


export async function POST(request: NextApiRequest, response: NextApiResponse<any>){
    
}
