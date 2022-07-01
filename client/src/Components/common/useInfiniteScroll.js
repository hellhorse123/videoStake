import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback) => {
  const [isFetching, setIsFetching] = useState(false);
  const [videos, setVideos] = useState({});

  let [error, setError] = useState(null);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // if (!isFetching) return(
    //     fetch('/api/videos/feed')
    //     .then(response => response.json())

    //     .then(result => {
    //         // console.log("result", result);
    //         setVideos(result)
    //             (!isFetching)
    //     })
    //     .catch(e => {
    //         console.log(e);
    //         setError(isFetching, e);
    //     })
    // )
    // console.log('uis', isFetching,'AAAAAAAAAAAAAAAAAAAA', videos)

    callback();
  }, [isFetching]);

  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;