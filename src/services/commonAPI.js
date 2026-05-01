import axios from "axios";


const commonAPI = async (httpMethod, url, reqBody, reqHeaders) => {
    const reqConfig = {
        method: httpMethod,
        url,
        headers: {
            "Content-Type": "application/json",
            ...reqHeaders,
        },
    }
    if (reqBody !== null && reqBody !== undefined) {
        reqConfig.data = reqBody;
    }

    return await axios(reqConfig).then((res) => {
        return res.data
    }).catch((err) => {
        throw err
    })
}

export default commonAPI