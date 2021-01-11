import React, { FunctionComponent, useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonButton,
  IonModal,
  IonIcon,
  IonMenuButton,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonLoading,
  IonSearchbar,
  IonProgressBar
} from '@ionic/react';

import PrintList from '../PrintList';
import { Plugins } from "@capacitor/core";
import { addOutline } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { isMobile } from '../../api/platforms';
import * as firebase from "firebase/app";
import "firebase/functions";
import { makeStyles } from '@material-ui/styles';

type MyPrintProps = {
  router: HTMLIonRouterOutletElement | null,
}

const useStyles = makeStyles({
  popover: {
    "--background": "var(--ion-color-light)",
  }
});

const MyPrints: FunctionComponent<MyPrintProps> = ({ router }: MyPrintProps) => {
  const classes = useStyles();
  const [ openAddPrint, setOpenAddPrint ] = useState(false);
  const [ showPopover, setShowPopover ] = useState<any>({open: false});
  const [ showLoading, setShowLoading ] = useState(false);
  const [ upload, setUpload ] = useState(1);
  const [ searchText, setSearchText ] = useState("");
    
  async function openFileBrowser() {
    setShowLoading(true);
    const functions = firebase.functions();
    const { FileBrowser } = Plugins;
    const getToken = firebase.functions().httpsCallable('getToken');
    const token = await getToken();
    setShowLoading(false);
    const listener = FileBrowser.addListener("didPickDocumentsAt", (data: any) => {
      const progress = data.progress;
      setUpload(progress/100);
      if (progress === 100) {
        listener.remove();
      }
    });
    FileBrowser.open({ token: token.data });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Prints</IonTitle>
          <IonButtons slot="primary">
            <IonButton
              onClick={(e) => {
                setShowPopover({open: true, event: e.nativeEvent});
              }}>
              <IonIcon slot="icon-only" icon={addOutline} />
            </IonButton>
            <IonPopover
              cssClass={classes.popover}
              event={showPopover.event}
              isOpen={showPopover.open}
              onDidDismiss={e => setShowPopover({open: false})}>
              <IonList>
                <IonItem 
                  onClick={() => {
                    openFileBrowser();
                    setShowPopover({open: false})
                  }} 
                  color="light" 
                  detail>
                  <IonLabel>
                    Upload File
                  </IonLabel>
                </IonItem>
                <IonItem color="light" detail lines="none">
                  <IonLabel>
                    Upload Multiple
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonPopover>
          </IonButtons>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Hi David</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar
          showCancelButton="focus"
          value={searchText} 
          onIonChange={e => setSearchText(e.detail.value!)} />
        {(upload === 1) ? null :
        <React.Fragment>
          <IonItem lines="none">
            <IonLabel>
              Uploading File
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonProgressBar value={upload} />
          </IonItem>
        </React.Fragment>
        }
        <PrintList 
          searchText={searchText}/>
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={'Creating secure connection...'}
        />
      </IonContent>
    </IonPage>
  );
};

export default MyPrints;
