import axios from "axios";


const commonAPI = async(httpMethod,url,reqBody,reqHeaders)=>{
    const reqConfig = {
        method:httpMethod,
        url,
        data:reqBody,
        headers:reqHeaders
    }
    return await axios(reqConfig).then((res)=>{
        return res.data
    }).catch((err)=>{
        throw err   
    })
}

export default commonAPI