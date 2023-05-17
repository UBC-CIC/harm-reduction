

export const handler = async(event) => {



    try{
        return{
            statuscode: 200,
            body: 'SUCCESS'
        }
    }catch(err){
        console.log(err);
        return{
            statuscode: 400,
            body: err
        }
    }
}