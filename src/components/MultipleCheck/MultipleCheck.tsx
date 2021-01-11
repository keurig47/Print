import React, { useState, useEffect } from 'react';
import { 
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonCheckbox,
} from '@ionic/react';
import { checkmark } from 'ionicons/icons';

type MultipleCheckGroupProps = {
  children?: any,
  value?: any,
  setAll: Function,
  onChange: Function,
  all?: boolean,
}

export const MultipleCheckGroup: React.FC<MultipleCheckGroupProps> = ({ all, setAll, children, value, onChange }) => {
  const [ selected, setSelected ] = useState([]);

  useEffect(() => {
    if (all) {
      onChange(React.Children.map(children, child => child.props.label));
    } else {
      onChange([]);
    }
  }, [ all ]);
  
  return (
    <IonList>
      {
        React.Children.map(children, child => {
          if (child) {
            return React.cloneElement(child, {
              all,
              value,
              onChange: onChange,
              setAll,
            })   
          }
        })
      }
    </IonList>
  );
};

type MultipleCheckProps = {
  all?: boolean,
  children?: any,
  value?: any,
  label: string,
  setAll?: Function,
  onChange?: Function,
}

export const MultipleCheck: React.FC<MultipleCheckProps>= ({ all, setAll, value, label, onChange }) => {

  useEffect(() => {
     
  }, []);
  
  return (
    <IonItem
      detail={false}
      onClick={() => {
        console.log('change', value, label);
        const newValues = [...value];
        if (newValues!.includes(label)) {
          const index = newValues.findIndex((element) => element === label);
          newValues.splice(index, 1);
          onChange!(newValues);
          if (all) {
            setAll!(!all)
          }
        } else {
          newValues!.push(label);
          onChange!(newValues);
        }
      }}
      button>
      <IonCheckbox
        slot="start"
        checked={(value && value.includes(label))} /> 
      <IonLabel>
        { label }
      </IonLabel>
    </IonItem>
  );
}

