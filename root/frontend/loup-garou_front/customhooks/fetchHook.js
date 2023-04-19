import { useState, useEffect } from "react";
import {LINKS} from "../constants"
import AsyncStorage from '@react-native-async-storage/async-storage'


/**
 * Does a fetch request to the back to the endpoint given as function argument 
 * and add the tha values places in query to the request parameters
 * @param {*} linkEndPoint the end point of the get request, the backend
 * can be found at the links in constants file 
 * @param {*} query Qeury holds the paramters taht we wish to add to the request
 * @returns an object that contains three values :
 * @param loading if loading that indicates if the request is loading and has not finished yet 
 * @param errorValue indicates if an error occured in the request and hold the value of that error
 * @param data hols the data that was recived that can be exploited one loading is false and no error
 * occured
 */
const useFetchCustom = async ( linkEndPoint, query) => {
  const [token, setToken] = useState({});
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [errorValue, setError] = useState(null);

  async function getToken(){
    try {
      value = await AsyncStorage.getItem('userToken').then(
        (value) => {
           console.log("value = ", value);
           setToken(value)
           return value;
        }
        )
      return value;
    } catch (error) {
      console.log('Error: ',error);
      return null;
    }
  }

  async function fetchData(){
    await getToken();
  const queryDetails = {
    method: "GET",
    headers: {
    "x-access-token": token 
    },
    params: { ...query },
  };
    console.log("query = " + JSON.stringify(queryDetails))
    
    setIsLoading(true);
    await fetch(LINKS.backend+linkEndPoint, queryDetails)
    .then(res => res.json())
    .then(res => {setIsLoading(false);setData(res);console.log(res)})
    .catch(error=>{
      setError(error);
      setIsLoading(false);
      console.log("error while executing whoami, error details : " + error);
    }) 
  }
  if (data!=null){

  }
  useEffect(() => {
    fetchData();
  }, []);


  return { data, loading, errorValue };
};


export  {
  useFetchCustom
};
