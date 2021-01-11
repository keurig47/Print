import React, { useEffect, useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonButton
} from '@ionic/react';
import CartList from '../CartList';

const Cart: React.FC = () => {
  const [ editMode, setEditMode ] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton
              onClick={() => {
                setEditMode(!editMode);
              }}>
              { editMode ? "Cancel" : "Edit"}
            </IonButton>
          </IonButtons>
          <IonTitle>
            Cart
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle 
              size="large">
              Cart
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <CartList 
          setEditMode={setEditMode}
          editMode={editMode} />
      </IonContent>
    </IonPage>
  );
};

export default Cart;
