import React, { useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonModal,
  IonAvatar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonText,
  IonNote,
} from '@ionic/react';
import * as firebase from "firebase/app";
import "firebase/auth";
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  option: {
    fontWeight: "bold",
  },
  item: {
    "--inner-padding-top": "10px",
    "--inner-padding-bottom": "10px",
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
  }
});

const Account: React.FC = () => {
  const classes = useStyles();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Account
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem
            detail
            lines="none">
            <div
              className={classes.header}>
              <IonAvatar
                style={{ margin: "20px" }}>
                <img src="https://i.pinimg.com/originals/7c/c7/a6/7cc7a630624d20f7797cb4c8e93c09c1.png"/>
              </IonAvatar>
              <div
                className={classes.headerInfo}>
                <IonText>
                  David Keimig
                </IonText>
                <IonNote>
                  davidkeimig@gmail.com
                </IonNote>
              </div>
            </div>
          </IonItem>
          <IonItemDivider />
          <IonItem
            className={classes.item}
            detail
            onClick={() => {
            }}>
            <IonLabel
              className={classes.option}>
              Primary Payment
            </IonLabel>
          </IonItem>
          <IonItem
            className={classes.item}
            detail
            onClick={() => {
            }}>
            <IonLabel
              className={classes.option}>
              Primary Shipping
            </IonLabel>
          </IonItem>
          <IonItem
            className={classes.item}
            detail
            onClick={() => {
            }}>
            <IonLabel
              className={classes.option}>
              Settings
            </IonLabel>
          </IonItem>
          <IonItem
            className={classes.item}
            detail
            onClick={() => {
              firebase.auth().signOut();
            }}>
            <IonLabel
              className={classes.option}>
              Sign Out
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Account;
