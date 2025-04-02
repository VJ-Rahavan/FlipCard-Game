import {useEffect, useState} from 'react';
import {firebase} from '@react-native-firebase/database';

const database = firebase.app().database();

const useDatabaseListener = <T>(path: string) => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!path) return;

    const dataRef = database.ref(path);

    const onDataChange = (snapshot: any) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData(null);
      }
    };

    // Listen for real-time updates
    dataRef.on('value', onDataChange);

    // Cleanup listener when component unmounts
    return () => {
      dataRef.off('value', onDataChange);
    };
  }, [path]);

  return data;
};

export default useDatabaseListener;
