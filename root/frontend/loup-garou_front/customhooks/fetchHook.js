import { useState, useEffect } from "react";
import axios from "axios";
import {LINKS} from "../constants"

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

  const queryDetails= {
    method: "GET",
    url: LINKS.backend+linkEndPoint,
    headers: {
    "x-access-token": "",// Async storage.getItem(token) 
                        //this value must be taken during the login process  
    },
    params: { ...query },
  };

  const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.request(options);
        //Every was done succefully and we store the data
        setData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        //If an error was caught we print it  
        //and we then set the retuned errorValue to it
        setError(error);
        console.log(errorValue)
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, errorValue };
};

export default useFetch;
