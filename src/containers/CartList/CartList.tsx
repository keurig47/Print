import React, { useState, useEffect, useRef } from 'react';
import { 
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItemGroup,
  IonThumbnail,
  IonLabel,
  IonNote,
  IonToast,
  IonCheckbox,
  IonSpinner,
} from '@ionic/react';
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { currentUserState } from '../../recoil';
import { useRecoilValue } from 'recoil';
import useDarkMode from 'use-dark-mode';
import { makeStyles } from '@material-ui/styles';

type CartListProps = {
  editMode: boolean,
  setEditMode: Function,
}

type CartItemProps = {
  item: any,
  edit: boolean,
}

const useStyles = makeStyles({
  cartItem: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  }
});

const CartItem: React.FC<CartItemProps> = ({ edit, item }) => {
  const [ thumbnail, setThumbnail ] = useState<string>("");
  const [ displayName, setDisplayName ] = useState<string>("");
  const currentUser = useRecoilValue(currentUserState);
  const darkMode = useDarkMode();
  const classes = useStyles();
  const sliderRef = useRef<any>(null);

  useEffect(() => {
    fetchThumbnail();
    let observer: any = null;
    if (currentUser) {
      const db = firebase.firestore();
      observer = db.collection(`prints/${currentUser}/files`).doc(item.name)
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
  }, []);

  useEffect(() => {
    if (edit) {
      sliderRef.current.close();
    }
  }, [ edit ])

  async function fetchThumbnail() {
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const parts = item.name.split('.');
    const prefix = parts.slice(0, parts.length - 1).join(".");
    storageRef.child(`thumbnails/${currentUser}/resized/${prefix}_50x50.png`).getDownloadURL().then(function(url) {
      setThumbnail(url);
    });
  }

  return (
    <IonItemSliding
      ref={sliderRef}
      disabled={edit}>
      <IonItem
        style={{
          "--inner-padding-top": "5px",
          "--inner-padding-bottom": "5px",
        }}>
        { edit && <IonCheckbox slot="start" color="primary" /> }
        {thumbnail ? 
          <IonThumbnail
            style={{
              marginRight: "10px",
              '--border-radius': "50px",
              background: darkMode.value ? "#424242" : "#c2c2c2"
            }}>
            <img src={thumbnail} />
          </IonThumbnail> :
          <IonSpinner />
        }
        <div
          className={classes.cartItem}>
          <IonLabel style={{ fontWeight: "bold" }}>
            {displayName}
          </IonLabel>
          <IonNote>
            {item.printer}
          </IonNote>
          <IonNote>
            {`Quantity: ${item.quantity}`}
          </IonNote>
        </div>
        <IonNote>
          $98.50
        </IonNote>
      </IonItem>
      <IonItemOptions 
        side="end">
        <IonItemOption
          onClick={async () => {
            const db = firebase.firestore();
            await db.collection(`carts/${currentUser}/cart`).doc(item.name).delete();
          }}
          color="danger">
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  )
}

const CartList: React.FC<CartListProps> = ({ editMode, setEditMode }) => {
  const [ items, setItems ] = useState<any>([]);
  const currentUser = useRecoilValue(currentUserState);

  useEffect(() => {
    let observer: any = null;
    if (currentUser) {
      const db = firebase.firestore();
      observer = 
        db.collection(`carts/${currentUser}/cart`)
        .onSnapshot(function(querySnapshot) {
          let items: [any?] = [];
          querySnapshot.forEach(function(doc) {
            const data = doc.data();
            items.push(data);
          });
          setItems(items);
        });
    }
    return () => {
      if (observer) {
        observer();
      }
    }
  }, []);


  return (
    <React.Fragment>
      <IonList>
        <IonItemGroup>
        {items.map((item: any, index: number) => {
          return (
            <CartItem
              edit={editMode}
              key={item.name}
              item={item}/>
          )
        })}
        </IonItemGroup>
      </IonList>
      <IonToast
        color="danger"
        isOpen={editMode}
        onDidDismiss={() => {
          setEditMode(false);
        }}
        message="Delete selected items?"
        position="bottom"
        buttons={[
          {
            text: "Confirm",
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]}
      />
    </React.Fragment>
  );
};

export default CartList;
