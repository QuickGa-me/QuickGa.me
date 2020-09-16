import {observer} from 'mobx-react';
import React from 'react';
import {FC, useEffect, useState} from 'react';
import {MessageType} from '../store/uiStore';

type Props = {message?: MessageType; setMessage: (message: MessageType | undefined) => void};

export const BottomMessage: FC<Props> = observer((props) => {
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<MessageType | undefined>(props.message);

  useEffect(() => {
    if (props.message !== lastMessage && props.message) {
      setShowMessage(true);
      setLastMessage(props.message);
      props.setMessage(undefined);
      setTimeout(() => {
        setShowMessage(false);
        setLastMessage(undefined);
      }, 4500);
    }
  }, [props.message, lastMessage]);

  if (!showMessage) {
    return null;
  }

  return (
    <div
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign:'center',
        margin: 10,
        padding: 10,
        marginTop: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderRadius: 5,
        ...(lastMessage?.type === 'success'
          ? {
              backgroundColor: 'green',
            }
          : {
              backgroundColor: 'red',
            }),
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 22,
        }}
      >
        {lastMessage?.message}
      </div>
    </div>
  );
});
