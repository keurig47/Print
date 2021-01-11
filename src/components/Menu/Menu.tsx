import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useLocation } from 'react-router-dom';
import { printOutline, personCircleOutline, cartOutline, print } from 'ionicons/icons';

interface AppPage {
  url: string;
  title: string;
  icon: string;
}

const appPages: AppPage[] = [
  {
    title: 'My Prints',
    url: '/myprints',
    icon: printOutline,
  },
  {
    title: 'Cart',
    url: '/cart',
    icon: cartOutline,
  },
  {
    title: 'Account',
    url: '/account',
    icon: personCircleOutline,
  }
];

const useStyles = makeStyles({
  list: {
    height: "100%"
  },
  selected: {
    "--background": "rgba(var(--ion-color-primary-rgb), 0.5)",
  }
});

const Menu: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList
          className={classes.list}>
          <IonListHeader>
            <IonTitle>
              Print
            </IonTitle>
          </IonListHeader>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={location.pathname === appPage.url ? classes.selected : ""} 
                  routerLink={appPage.url} 
                  routerDirection="none" 
                  lines="none" 
                  detail={false}>
                  <IonIcon slot="start" icon={appPage.icon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
