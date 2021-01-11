import React, { useState, useEffect, useRef } from 'react';
import Viewer from '../Viewer';
import { makeStyles } from '@material-ui/styles';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonLabel,
  IonItem,
  IonAlert,
} from '@ionic/react';
import ProductOptions from "../ProductOptions";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ellipsisHorizontal, cart } from 'ionicons/icons';
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../../recoil';
import { useHistory } from "react-router-dom";
import { isMobile } from "../../api/platforms";

const useStyles = makeStyles({
  popover: {
  },
  buyButtonMobile: {
    position: "fixed",
    zIndex: 999,
    top: 750,
    left: 10,
    width: "calc(100% - 20px)",
  },
  buyButtonDesktop: {
    float: "right",
    margin: "10px"
  }
});

const Preview: React.FC = () => {
  const history = useHistory();
  const contentRef = useRef<any>(null);
  const [ displayName, setDisplayName ] = useState("");
  const [ showPopover, setShowPopover ] = useState<any>({open: false});
  const [ showRenameAlert, setShowRenameAlert ] = useState(false);
  const location = useLocation();
  const currentUser = useRecoilValue(currentUserState);
  const classes = useStyles();
  const { name } = useParams();

  useEffect(() => {
    let observer: any = null;
    if (currentUser) {
      const db = firebase.firestore();
      observer = db.collection(`prints/${currentUser}/files`).doc(name)
        .onSnapshot(function(querySnapshot) {
          const data = querySnapshot.data();
          setDisplayName(data!.displayName);
        });
    }

    return () => {
      if (observer) {
        observer();
      }
    }
  }, [ name ]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{displayName}</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={(e) => {
                setShowPopover({open: true, event: e.nativeEvent})
              }}>
              <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
            </IonButton>
            <IonPopover
              showBackdrop
              cssClass={classes.popover}
              event={showPopover.event}
              isOpen={showPopover.open}
              onDidDismiss={e => setShowPopover({open: false})}>
              <IonList>
                <IonItem
                  detail
                  onClick={() => {
                    setShowRenameAlert(true);
                    setShowPopover(false);
                  }}>
                  <IonLabel>
                    Rename
                  </IonLabel>
                </IonItem>
                <IonItem 
                  onClick={async () => {
                    setShowPopover({open: false});
                    const db = firebase.firestore();
                    await db.collection(`prints/${currentUser}/files`).doc(name).delete();
                    history.push("/myprints");
                  }} 
                  color="danger" 
                  detail>
                  <IonLabel>
                    Delete
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent
        ref={contentRef}>
        <IonAlert
          isOpen={showRenameAlert}
          onDidDismiss={() => setShowRenameAlert(false)}
          header={`Rename ${displayName}`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                setShowRenameAlert(false);
              }
            },
            {
              text: 'Ok',
              handler: async (value: any) => {
                setShowRenameAlert(false);
                const db = firebase.firestore();
                await db.collection(`prints/${currentUser}/files`).doc(name).set({
                  displayName: value.rename, 
                }, { merge: true });
              }
            }
          ]}
          inputs={[
            {
              name: "rename",
              type: "text",
              placeholder: "Enter a new name..."
            }
          ]}/>
        <Viewer
          name={name}/>
        <ProductOptions 
          productName={name}/>
        <IonButton
          onClick={async () => {
            const db = firebase.firestore();
            const cartRef = db.collection(`carts/${currentUser}/cart`).doc(name);
            await cartRef.set({
              name,
              printer: "Printer",
              material: "Material",
              color: "Blue",
              quantity: 3,
            });
          }}
          className={isMobile ? classes.buyButtonMobile : classes.buyButtonDesktop}>
          <IonIcon icon={cart} slot="start"/>
          Add To Cart
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Preview;
