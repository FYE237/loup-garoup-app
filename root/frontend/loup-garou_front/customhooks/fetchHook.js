import { useState, useEffect } from "react";
import {LINKS} from "../constants"
import AsyncStorage from '@react-native-async-storage/async-storage'


/**
 * This method tries to locate the token from the local storage
 * and the it saves so that we can use it later on
 * @returns 
 */
export async function getToken(){
  try {
    let value = await AsyncStorage.getItem('userToken').then(
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
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [errorValue, setError] = useState(null);



  async function fetchData(){
    let tokenVal =  await getToken()
    const queryDetails = {
      method: "GET",
      headers: {
      "x-access-token": tokenVal
      },
    };
    // console.log("query = " + JSON.stringify(queryDetails))
      
    setIsLoading(true);
    try{
      const response = await fetch(LINKS.backend+linkEndPoint, queryDetails);
      const data = await response.json();
      console.log("Data recieved from request : "+data);
      setData(data);
    } catch (error) {
        console.log("Fetch ran into an error : "+error);
        setIsLoading(false);
        setError(error);
    } finally {
        setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, [linkEndPoint]);


  return { data, loading, errorValue };
};


// export  {
//   useFetchCustom,
//   getToken
// };
