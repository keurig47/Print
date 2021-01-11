import React, { useState, useEffect, useRef } from 'react';
import * as BabylonViewer from '@babylonjs/viewer';
import {
  IonSpinner,
  IonImg,
  CreateAnimation,
} from '@ionic/react';
import { makeStyles } from '@material-ui/styles';
import '@babylonjs/loaders/STL';
import { NullEngine } from "@babylonjs/core/Engines/nullEngine";
import { Scene } from "@babylonjs/core/scene";
import { useParams } from "react-router-dom";
import * as firebase from "firebase/app";
import "firebase/storage";
import useDarkMode from 'use-dark-mode';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../../recoil';

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "50vh!important",

    'canvas': {
      width: "100%",
      height: "200px",
    }
  },
  loading: {
    width: "100",
    height: "100%",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    height: "50vh"
  },
  previewContainer: {
    height: "50vh",
  }
});

type ViewerProps = {
  name: string
}

const Viewer: React.FC<ViewerProps> = ({ name }) => {
  const [ previewImage, setPreviewImage ] = useState("");
  const [ showViewer, setShowViewer ] = useState(false);
  const darkMode = useDarkMode();
  const currentUser = useRecoilValue(currentUserState);
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const render = useRef<boolean>(false);
  const animationRef = useRef<CreateAnimation>(null);
  const classes = useStyles();

  useEffect(() => {
    if (viewerRef.current && render.current && showViewer) {
      const storage = firebase.storage();
      const storageRef = storage.ref();
      storageRef.child(`files/${currentUser}${name}`).getDownloadURL().then(function(url) {
        viewerRef.current.updateConfiguration({
          model: {
            url, 
          }
        });
        viewerRef.current.loadModel();
      })
    }
  }, [ showViewer, name ]);

  async function fetchPreviewImage() {
    const db = firebase.firestore();
    const doc = await db.collection(`prints/${currentUser}/files`).doc(name).get();
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const data = doc.data();
    if (data!.thumbnailPath) {
      storageRef.child(data!.thumbnailPath).getDownloadURL().then(function(url) {
        setPreviewImage(url);
      })
    }
  }

  useEffect(() => {
    fetchPreviewImage();
    if (viewerRef.current && showViewer) {
      viewerRef.current.updateConfiguration({
        environmentMap: {
          mainColor: darkMode.value ? { r: 0, g: 0, b: 0 } : { r: 0.8823529411764706, g: 0.8823529411764706, b: 0.8823529411764706 }, 
        }
      });
    }
  }, [ showViewer, viewerRef.current, darkMode ])

  useEffect(() => {
    if (canvasRef.current && !render.current && showViewer) {
      render.current = true;
      const storage = firebase.storage();
      const storageRef = storage.ref();
      storageRef.child(`files/${currentUser}/${name}`).getDownloadURL().then(function(url) {
      viewerRef.current = new BabylonViewer.DefaultViewer(canvasRef.current as Element, {
          templates: {
            main: {},
            loadingScreen: {
              location: "#loading-screen",
              params: {
                backgroundColor: "transparent",
              }
            }
          },
          camera: {
            behaviors: {
              autoRotate: 0
            }
          },
          model: {
            url,
          },
          environmentMap: {
            texture: "EnvMap_3.0-256.env",
            rotationY: 3,
            tintLevel: 0.4,
            mainColor: darkMode.value ? { r: 0, g: 0, b: 0 } : { r: 0.8823529411764706, g: 0.8823529411764706, b: 0.8823529411764706 }, 
          }
        });
      });
    }
  }, [ showViewer, canvasRef.current, name ])

  return (
    <React.Fragment>
      {(!showViewer) &&
      <div 
        style={{
          background: darkMode.value ? "#424242" : "#c2c2c2", 
          cursor: "pointer" 
        }}
        className={classes.previewContainer}>
        <CreateAnimation
          ref={animationRef}
          easing="ease-in"
          duration={250}
          keyframes={[
            { transform: 'scale(0)' },
            { transform: 'scale(1)' },
          ]}>
            <IonImg
              onIonImgDidLoad={() => {
                if (animationRef.current) {
                  animationRef.current.animation!.play();
                }
              }}
              alt="" 
              onClick={() => {setShowViewer(true)}}
              className={classes.previewImage}
              src={previewImage} />
        </CreateAnimation>
      </div>}
      {(showViewer) && <div className={classes.root} ref={canvasRef}/>}
      <script id="loading-screen" type="text/x-babylon-viewer-template">
        <div className={classes.loading}>
          <IonSpinner/>
        </div>
      </script>
    </React.Fragment>
  )
}

export default Viewer;
