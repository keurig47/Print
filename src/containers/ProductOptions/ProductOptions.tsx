import React, { useState } from 'react';
import { 
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSelect,
  IonButton,
  IonSelectOption,
  IonItemDivider,
} from '@ionic/react';
import { makeStyles } from '@material-ui/styles';

type ProductOptionsProps = {
  productName: string,
}

const useStyles = makeStyles({
  label: {
    padding: "5px 0px",
    display: 'flex',
    flexDirection: 'column',
  },
  bold: {
    fontWeight: "bold",
  },
  divider: {
    height: "64px"
  }
});

const ProductOptions: React.FC<ProductOptionsProps> = ({ productName }) => {
  const classes = useStyles();
  const [ quantity, setQuantity ] = useState(1);
  const [ material, setMaterial ] = useState("Any");
  
  function getQuantityOptions() {
    let options = [];
    for (let i = 1; i <= 10; i++) {
      options.push(
        <IonSelectOption value={i}>{i}</IonSelectOption>
      )
    }
    return options;
  }

  return (
    <IonList>
      <IonItem
        routerLink={`/myprints/${productName}/printers`}>
        <div className={classes.label}>
          <IonLabel>Printer Type:</IonLabel>
          <IonNote color="primary">Any</IonNote>
        </div>
      </IonItem>
      <IonItem
        routerLink={`/myprints/${productName}/printers`}>
        <div className={classes.label}>
          <IonLabel>Printer:</IonLabel>
          <IonNote color="primary">Any</IonNote>
        </div>
      </IonItem>
      <IonItem
        routerLink={`/myprints/${productName}/printers`}>
        <div className={classes.label}>
          <IonLabel>Material:</IonLabel>
          <IonNote color="primary">Any</IonNote>
        </div>
      </IonItem>
      <IonItem
        routerLink={`/myprints/${productName}/printers`}>
        <div className={classes.label}>
          <IonLabel>Color:</IonLabel>
          <IonNote color="primary">Any</IonNote>
        </div>
      </IonItem>
      <IonItem lines="none">
        <IonLabel>Quantity</IonLabel>
        <IonSelect value={quantity} okText="Okay" cancelText="Dismiss" onIonChange={e => {}}>
          {getQuantityOptions()}
        </IonSelect>
      </IonItem>
      <IonItem className={classes.divider}></IonItem>
    </IonList>
  )
}

export default ProductOptions;




