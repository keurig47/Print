import React, { useEffect, useState } from 'react';
import { 
  IonGrid,
  IonRow,
} from '@ionic/react';
import PrintCard from "../PrintCard";
import { useHistory } from "react-router-dom";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../../recoil';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  grid: {
    '--ion-grid-padding': "5px"
  }
});

type PrintListProps = {
  searchText: string
}

const PrintList: React.FC<PrintListProps> = ({ searchText }) => {
  const classes = useStyles();
  const [ files, setFiles ] = useState<[any?]>([]);
  const currentUser = useRecoilValue(currentUserState);
  const history = useHistory();

  useEffect(() => {
    let observer: any = null;
    if (currentUser) {
      const db = firebase.firestore();
      observer = 
        db.collection(`prints/${currentUser}/files`)
        .onSnapshot(function(querySnapshot) {
          let files: [any?] = [];
          querySnapshot.forEach(function(doc) {
            const data = doc.data();
            if (data.displayName.toLowerCase().includes(searchText.toLowerCase())) {
              files.push(data);
            }
          });
          setFiles(files);
        });
    }

    return () => {
      if (observer) {
        observer();
      }
    }
  }, [ searchText ]);

  return (
    <IonGrid
      className={classes.grid}>
      <IonRow>
      {files.map((file, index) => {
        const filePath = file.filePath;
        const parts = filePath.split('/');
        const name = parts[parts.length - 1];
        return (
          <PrintCard
            displayName={file.displayName}
            name={name}
            index={name} />
        )
      })}
      </IonRow>
    </IonGrid>
  );
};

export default PrintList;
