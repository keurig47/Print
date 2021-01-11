import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonSearchbar,
  IonIcon,
  IonButton,
  IonSkeletonText
} from '@ionic/react';
import { MultipleCheckGroup, MultipleCheck } from '../../components/MultipleCheck';
import { makeStyles } from '@material-ui/styles';
import { checkmark } from 'ionicons/icons';
import * as firebase from "firebase/app";
import { printerSelectedState } from '../../recoil';
import { useRecoilState } from 'recoil';
import "firebase/functions";

const useStyles = makeStyles({

});

const PrinterOptions: React.FC = () => {
  const classes = useStyles();
  const [ printers, setPrinters ] = useState<any>([]);
  const [ searchText, setSearchText ] = useState("");
  const [ all, setAll ] = useState<boolean>(true);
  const [ selected, setSelected ] = useRecoilState<any>(printerSelectedState);
  const [ loading, setLoading ] = useState(false);

  async function queryPrinters() {
    const functions = firebase.functions();
    const searchPrinter = firebase.functions().httpsCallable('searchPrinter');
    const query = { size: 10 };
    const result = await searchPrinter(query);
    setPrinters(result.data);
    setSelected((result.data.length > 0) ? [result.data[0]._source.name] : [""]);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    queryPrinters();
  }, []);

  function getView() {
    if (loading) {
      let elems = [];
      for (let i = 0; i < 50; i++) {
        const length = Math.floor(Math.random() * 60) + 25;  
        elems.push(
          <IonItem key={i}>
            <IonSkeletonText 
              animated 
              style={{ width: `${length}%` }} />
          </IonItem>
        )
      }
      return elems;
    }
    return (
      <MultipleCheckGroup
        all={all}
        setAll={setAll}
        value={selected}
        onChange={(value: any) => {
          setSelected(value);
        }}>
        {printers.map((printer: any, index: number) => {
          const { _source } = printer;
          const { name } = _source;
          if (name.toLowerCase().includes(searchText.toLowerCase())) {
            return (
              <MultipleCheck 
                key={name}
                label={name} />
            )
          }
        })}
      </MultipleCheckGroup>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setAll(!all)
              }}>
              { all ? "Deselect All" : "Select All" }
            </IonButton>
          </IonButtons>
            <IonSearchbar 
              value={searchText} 
              onIonChange={e => setSearchText(e.detail.value!)}>
            </IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList
          inset={false}>
          {getView()}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default PrinterOptions;
