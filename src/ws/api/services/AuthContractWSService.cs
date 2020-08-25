using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using nex.ws;

namespace demo.wsclient
{
    public class AuthContractWSService<TUser, TToken>: WSServiceBase<TUser, TToken>
    {
        #region [ implement WSServiceBase ]
        public override string Name { get { return "authContract"; } }
        #endregion

        #region [ constructor ]
        public AuthContractWSService(RestClient<TUser, TToken> rest, HubClient<TUser, TToken> hub)
            :base(rest, hub)
        {
            _onUpdate = new HubNotification<TUser, TToken>(hub, Name, "onUpdate");
            _onDataUpdate = new HubNotificationData<TUser, TToken, DataType>(hub, Name, "onDataUpdate");
        }
        #endregion

        #region [ hub private ]
        private HubNotification<TUser, TToken> _onUpdate { get; }
        private HubNotificationData<TUser, TToken, DataType> _onDataUpdate { get; }
        #endregion

        #region [ hub public ]

        // isAuth: true
        public HubNotification<TUser, TToken> onUpdate { get { return _onUpdate; } }

        // isAuth: true
        public HubNotificationData<TUser, TToken, DataType> onDataUpdate { get { return _onDataUpdate; } }
        #endregion

        #region [ rest ]

        // isAuth: true
        public Task print() { return Request( "print", null, null  ); }

        // isAuth: true
        public Task notify() { return Request( "notify", null, null  ); }
        #endregion
    }
}
