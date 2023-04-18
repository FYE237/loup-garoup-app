import { useState, useEffect } from "react";
import {LINKS} from "../constants"
import {AsyncStorage} from '@react-native-async-storage/async-storage';


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
const useFetch = ( linkEndPoint, query) => {
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [errorValue, setError] = useState(null);

  const queryDetails = {
    method: "GET",
    headers: {
      "x-access-token": AsyncStorage.getItem("token"),  
      },
    params: { ...query },
  };
  function fetchData(){
    fetch(LINKS.backend+linkEndPoint, queryDetails)
    .then(res => res.json())
    .then(res => {setData(res);setIsLoading(false);})
    .catch(error=>{
      setError(error);
      setIsLoading(false);
      console.log("error while adding tag, error details : " + error);
    }) 
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, errorValue };
};

export default useFetch;
