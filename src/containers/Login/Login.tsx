import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import * as firebase from "firebase/app";
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../../recoil';
import "firebase/auth";
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {
  const history = useHistory();
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const currentUser = useRecoilValue(currentUserState);

  useEffect(() => {
    if (currentUser) {
      history.push("/myprints");
    }
  }, [currentUser]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonInput
          onIonChange={(evt) => {
            setUsername(evt.detail.value!);
          }}
          value={username}>
        </IonInput>
        <IonInput
          onIonChange={(evt) => {
            setPassword(evt.detail.value!);
          }}
          value={password}>
        </IonInput>
        <IonButton
          onClick={async () => {
            await firebase.auth().signInWithEmailAndPassword(username, password);
          }}>
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
