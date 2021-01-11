import React, { FunctionComponent, useEffect, useRef } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonModal,
  IonSplitPane,
  RouterOptions,
  setupConfig,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { printOutline, personCircleOutline, cartOutline } from 'ionicons/icons';
import Cart from './containers/Cart';
import MyPrints from './containers/MyPrints';
import Account from './containers/Account';
import Login from './containers/Login';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import { ThemeProvider } from '@material-ui/styles';
import Menu from './components/Menu';
import Preview from './containers/Preview';
import PrinterOptions from './containers/PrinterOptions';
import { isMobile } from './api/platforms';
import { useRecoilState } from 'recoil';
import { currentUserState } from './recoil';
import { useHistory } from "react-router-dom";
import { Plugins, KeyboardStyle } from "@capacitor/core";
import useDarkMode from 'use-dark-mode';

const firebaseConfig = {
  apiKey: "AIzaSyCqzcOrDM_2vgSngsPpRTV44wzfCiQ5SC0",
  authDomain: "print-3aa78.firebaseapp.com",
  databaseURL: "https://print-3aa78.firebaseio.com",
  projectId: "print-3aa78",
  storageBucket: "print-3aa78.appspot.com",
  messagingSenderId: "168995981973",
  appId: "1:168995981973:web:f666d215f945fe501da99c",
  measurementId: "G-TFFLL6JVX0"
};

firebase.initializeApp(firebaseConfig);

setupConfig({swipeBackEnabled: false});

const theme = {};

const App: React.FC = () => {
  const routerRef = useRef<HTMLIonRouterOutletElement | null>(null);
  const darkMode = useDarkMode();
  const [ currentUser, setCurrentUser ] = useRecoilState(currentUserState);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('SIGNED IN!', routerRef.current);
        setCurrentUser(user.uid);
      } else {
        console.log('SIGNED OUT', routerRef.current);
        setCurrentUser('');
      }
    });
  }, []);

  function setKeyboardTheme() {
    const { Keyboard } = Plugins;
    Keyboard.setStyle({ style: darkMode.value ? KeyboardStyle.Dark : KeyboardStyle.Light });
  }

  useEffect(() => {
    setKeyboardTheme();
  }, []);

  useEffect(() => {
    setKeyboardTheme();
  }, [ darkMode ]);

  function getRouterOutlet() {
    return (
      <IonRouterOutlet id="main" ref={routerRef}>
        <Route path="/:tab(myprints)" exact={true} render={(props) => <MyPrints router={routerRef.current}/> }/>
        <Route path="/:tab(myprints)/:name" exact={true} component={Preview} />
        <Route path="/:tab(myprints)/:name/printers" component={PrinterOptions} />
        <Route path="/:tab(cart)" component={Cart} />
        <Route path="/:tab(account)" component={Account} />
        <Route path="/login" component={Login} />
        <Route path="/" render={() => <Redirect to="/login"/>} exact={true} />
      </IonRouterOutlet>
    )
  }

  function getDesktopLayout() {
    return (
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu/>
          {getRouterOutlet()}
        </IonSplitPane>
      </IonReactRouter>
    )
  }

  function getMobileLayout() {
    return (
      <IonReactRouter>
        <IonTabs>
          {getRouterOutlet()}
          <IonTabBar slot="bottom">
            <IonTabButton tab="myprints" href="/myprints">
              <IonIcon icon={printOutline} />
              <IonLabel>My Prints</IonLabel>
            </IonTabButton>
            <IonTabButton tab="cart" href="/cart">
              <IonIcon icon={cartOutline} />
              <IonLabel>Cart</IonLabel>
            </IonTabButton>
            <IonTabButton tab="account" href="/account">
              <IonIcon icon={personCircleOutline} />
              <IonLabel>Account</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    )
  }

  const getLayout = () => {
    if (!currentUser) {
     return (
      <IonReactRouter>
        <IonRouterOutlet id="main" ref={routerRef}>
          <Route path="/:all" component={Login} />
          <Route path="/" render={() => <Redirect to="/login"/>} exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
     )
    }

    if (isMobile) {
      return getMobileLayout();
    }
    return getDesktopLayout();
  }

  return (
  <ThemeProvider theme={theme}>
    <IonApp>
      {getLayout()}
    </IonApp>
  </ThemeProvider>)
};

export default App;
