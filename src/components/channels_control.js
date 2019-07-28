import React from 'react';

const ChannelsControl = ({ socket, channels, join, leave }) => {
  return (
    <ul className='my-list'>
      {
        channels && 
        channels.map(channel => 
          channel.state ?
            <li key={channel.topic}>
              {channel.topic}&nbsp;
              <a
                className="text-primary" 
                onClick={() => leave(channel.topic)} >
                Disconnect
              </a>
            </li>
            :
            <li key={channel.topic}>
              {channel.topic}&nbsp;
              <a
                className="text-primary"
                onClick={() => join(socket, channel.topic)} >
                Reconnect
              </a>
            </li>
        )
      }
    </ul>
  );
};

export default ChannelsControl;