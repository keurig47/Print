import React, { useEffect, useState } from 'react';
import { 
  IonThumbnail, 
  IonImg,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonLoading,
  IonSkeletonText
} from '@ionic/react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../../recoil';
import * as firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import "firebase/storage";

type PrintCardProps = {
  displayName: string,
  name: string,
  index?: any
}

const PrintCard: React.FC<PrintCardProps> = ({ name, displayName }) => {
  const [ imageUrl, setImageUrl ] = useState("");
  const currentUser = useRecoilValue(currentUserState);
  const history = useHistory();

  useEffect(() => {
    let observer: any = null;
    if (currentUser) {
      const db = firebase.firestore();
      observer = db.collection(`prints/${currentUser}/files/${name}/thumbnails`)
        .onSnapshot(function(querySnapshot) {
          let images: [any?] = [];
          querySnapshot.forEach(function(doc) {
            const path: string = doc.data().path;
            if (path && path.endsWith("_200x200.png")) {
              const storage = firebase.storage();
              const pathRef = storage.ref(path);
              pathRef.getDownloadURL().then(function(url) {
                setImageUrl(url);
              });
            }
          });
        });
    }
  
    return () => {
      if (observer) {
        observer();
      }
    }

  }, [ name ]);

  return (
    <IonCol sizeXs="6" sizeSm="5" sizeMd="5" sizeLg="4" sizeXl="4">
      <IonCard
        style={{ margin: 0, height: "100%"}}
        button
        color="primary"
        onClick={() => {
          history.push({
            pathname: `/myprints/${name}`,
            state: {
              displayName,
              name,
            }
          });
        }}>
        { imageUrl ? 
          <IonImg style={{ margin: "auto", width: "200px", height: "200px" }} src={imageUrl} /> :
          <IonSkeletonText animated style={{ width: '100%', height: '200px' }} /> 
        }
        <IonCardHeader>
          <IonCardSubtitle>
            David Keimig
          </IonCardSubtitle>
          <IonCardTitle>
            {displayName}
          </IonCardTitle>
        </IonCardHeader>
      </IonCard>
    </IonCol>
  )
}

export default PrintCard;
